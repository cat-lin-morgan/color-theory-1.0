import gql from 'graphql-tag';

export const QUERY_PALETTES = gql`
	query palettes($username: String) {
		palettes(username: $username) {
			_id
			title
            description
            primary
            secondary
            accent1
            accent2
			accent3
			username
			upvoteCount
			tags {
				_id
				name
			}
			upvotes {
				username
			}
			createdAt
			saveCount
			saves {
				username
			}
		}
	}
`;

export const QUERY_PALETTE = gql`
	query palette($id: ID!) {
		palette(_id: $id) {
			_id
			title
            description
            primary
            secondary
            accent1
            accent2
			accent3
			username
			upvoteCount
			tags {
				_id
				name
			}
			upvotes {
				username
			}
			createdAt
			saveCount
			saves {
				username
			}
		}
	}
`;

export const QUERY_USER = gql`
	query user($username: String!) {
		user(username: $username) {
			_id
			username
			email
			myPalettes {
        		_id
				title
				description
				primary
				secondary
				accent1
				accent2
				accent3
				username
				upvoteCount
				createdAt
				saveCount
			}
			favorites {
        		_id
				title
				description
				primary
				secondary
				accent1
				accent2
				accent3
				username
				upvoteCount
				createdAt
				saveCount
			}
		}
	}
`;

export const QUERY_ME = gql`
	{
		me {
			_id
			username
			email
			myPalettes {
        		_id
				title
				description
				primary
				secondary
				accent1
				accent2
				accent3
				username
				upvoteCount
				createdAt
				saveCount
			}
			favorites {
        		_id
				title
				description
				primary
				secondary
				accent1
				accent2
				accent3
				username
				upvoteCount
				createdAt
				saveCount
			}
		}
	}
`;

export const QUERY_TAG = gql`
	query tag($name: String!) {
		tag(name: $name) {
			_id
			name
			taggedPalettes{
				_id
			}
		}
	}
`;

export const QUERY_SEARCH_ALL_PALETTES = gql`
{
	palettes {
		_id
		title
		description
		primary
		secondary
		accent1
		accent2
		accent3
		username
		upvoteCount
		tags {
			_id
			name
		}
		upvotes {
			username
		}
		createdAt
		saveCount
		saves {
			username
		}
	}
}
`;