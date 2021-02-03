const { AuthenticationError } = require('apollo-server-express');
const { User, Palette } = require('../models');
const Tag = require('../models/Tag');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({
					_id: context.user._id,
				})
					.select('-__v -password')
					.populate('myPalettes')
					.populate('favorites')
				return userData;
			}

			throw new AuthenticationError('Not logged in');
        },
		user: async (parent, { username }) => {
			return User.findOne({ username })
				.select('-__v -password')
				.populate('myPalettes')
				.populate('favorites');
        },
        palettes: async (parent, { username }) => {
			const params = username ? { username } : {};
			return Palette.find(params).sort({ createdAt: -1 })
				.populate('tags');
		},
		palette: async (parent, { _id }) => {
			return Palette.findOne({ _id })
				.populate('tags');
		},
		tag: async (parent, {name}) => {
			return Tag.findOne({name});
		},
		searchAllPalettes: async () => {
			return await Palette.find();
		}
    },
    Mutation: {
        addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);

			return { token, user };
		},
		login: async (parent, { username, password }) => {
			const user = await User.findOne({ username });

			if (!user) {
				throw new AuthenticationError(
					'Incorrect credentials'
				);
			}

			const correctPw = await user.isCorrectPassword(
				password
			);

			if (!correctPw) {
				throw new AuthenticationError(
					'Incorrect credentials'
				);
			}

			const token = signToken(user);
			return { token, user };
        },
        addPalette: async (parent, args, context) => {
            console.log("context user ------");
            console.log(context.user);
			if (context.user) {
				const palette = await Palette.create({
					...args,
					username: context.user.username,
                });
                console.log("palette below")
                const id = palette._id;
                console.log(id);

				await User.findByIdAndUpdate(
                    { _id: context.user._id },
					{ $push: { myPalettes: id } },
					{ new: true }
                );

                console.log({palette});
				return palette;
			}

			throw new AuthenticationError(
				'You need to be logged in to add a palette!'
			);
        },
        removePalette: async (parent, {_id}, context) => {
			if (context.user) {
				const deletePalette = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $pull: { myPalettes: {_id} } },
					{ new: true, runValidators: true }
				);

				delete deletePalette;

				return deletePalette;
			}
		},
		addUpvote: async (parent, {paletteId}, context) => {
			console.log(paletteId);
			if (context.user) {
				const updatedPalette = await Palette.findOneAndUpdate(
				  { _id: paletteId },
				  { $addToSet: { upvotes: context.user._id } },
				  { new: true }
				);
			
				return updatedPalette;
			  }
			
			  throw new AuthenticationError('You need to be logged in!');
		},
		addFavPalette: async (parent, {paletteId}, context) => {
			if (context.user) {
				const updatedPalette = await Palette.findOneAndUpdate(
				  { _id: paletteId },
				  { $addToSet: { saves: context.user._id } },
				  { new: true }
				);

				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id  },
					{ $addToSet: { favorites: paletteId } },
					{ new: true }
				  );
			
				return updatedPalette;
			  }
			
			  throw new AuthenticationError('You need to be logged in!');
		},
        createTag: async (parent, args) => {
			const tag = await Tag.create(args);
		
			return tag;
		},
		linkTagToPalette: async (parent, {paletteId, tagId}, context) => {
			if (context.user) {
				const updatedPalette = await Palette.findOneAndUpdate(
				  { _id: paletteId },
				  { $addToSet: { tags: tagId} },
				  { new: true }
				);

				const updatedTag = await Tag.findOneAndUpdate(
					{ _id: tagId  },
					{ $addToSet: { taggedPalettes: paletteId } },
					{ new: true }
				  );
			
				return updatedTag;
			  }
			
			  throw new AuthenticationError('You need to be logged in!');
		}
    }
};

module.exports = resolvers;