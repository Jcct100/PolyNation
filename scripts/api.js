import axiosAPI from 'axios';
import Cookies from 'js-cookie';

let authToken = null;
const baseURL = 'https://core.polynation.wearefx.uk/wp-json';

const axios = axiosAPI.create({
    baseURL: `${baseURL}/poly-core/v1`
});

if (Cookies.get('token')) {
    axios.defaults.headers.common.Authorization = `Bearer ${Cookies.get('token')}`;
}

const checkToken = (error) => {
    // 403 - Forbidden with the correct resopnse codes.
    // 401 - Unathorized
    if ((error.response.status === 403 && (error.response.code === 'poly_endpoint_restriction' || error.response.code === 'poly_token_revoked')) || error.response.status === 401) {
        // Remove token from cookies
        Cookies.remove('token');

        // eslint-disable-next-line no-alert
        window.alert('Your token is invalid, please login again');

        // Redirect to login page
        window.location.replace('/login');
    }
};

const get = (path, headers) => {
    return new Promise((resolve, reject) => {
        axios.get(path, headers)
            .then(resolve)
            .catch((error) => {
                checkToken(error);
                reject(error);
            });
    });
};

const put = (path, data) => {
    return new Promise((resolve, reject) => {
        axios.put(path, data)
            .then(resolve)
            .catch((error) => {
                checkToken(error);
                reject(error);
            });
    });
};

const post = (path, data) => {
    return new Promise((resolve, reject) => {
        axios.post(path, data)
            .then(resolve)
            .catch((error) => {
                checkToken(error);
                reject(error);
            });
    });
};

// Uses 'remove' instead of delete
const remove = (path, data) => {
    return new Promise((resolve, reject) => {
        axios.delete(path, data)
            .then(resolve)
            .catch((error) => {
                checkToken(error);
                reject(error);
            });
    });
};

// User login
export const loginUser = (data) => {
    return new Promise((resolve, reject) => {
        post(`${baseURL}/jwt-auth/v1/token`, data)
            .then((res) => {
                authToken = res.data.token;

                // Adds the token to the header
                axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
                Cookies.set('token', authToken);

                resolve(res.data);
                Cookies.set('token', authToken, { expires: new Date(res.data.this_token_expires) });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// User logout
export const logoutUser = () => {
    return new Promise((resolve, reject) => {
        put('/me/logout')
            .then((res) => {
                resolve(res);

                Cookies.remove('token');

                // Redirects to login page on logout
                window.location.replace('/login');
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get user info
export const getUser = () => {
    return new Promise((resolve, reject) => {
        get('/me')
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Trending
export const getTrending = () => {
    return new Promise((resolve, reject) => {
        get('/components/trending')
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get an artist
export const getArtist = (id) => {
    return new Promise((resolve, reject) => {
        get(`/artists/${id}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get a venue
export const getVenue = (id) => {
    return new Promise((resolve, reject) => {
        get(`/venues/${id}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get upcoming gigs
export const getUpcomingGigs = (id, data) => {
    return new Promise((resolve, reject) => {
        get(`artists/${id}/upcoming-gigs`, {
            params: {
                'sidebar-context': data.context,
                limit: data.limit
            }
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get venue upcoming gigs
export const getVenueUpcomingGigs = (id, data) => {
    return new Promise((resolve, reject) => {
        get(`venues/${id}/upcoming-gigs`, {
            params: {
                'sidebar-context': data.context,
                limit: data.limit
            }
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get an artist's related
export const getArtistRelated = (id) => {
    return new Promise((resolve, reject) => {
        get(`artists/${id}/related`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get a venue's related
export const getVenueRelated = (id) => {
    return new Promise((resolve, reject) => {
        get(`venues/${id}/related`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get a gig's related
export const getGigRelated = (id) => {
    return new Promise((resolve, reject) => {
        get(`gigs/${id}/related`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get a gig
export const getGig = (id) => {
    return new Promise((resolve, reject) => {
        get(`gigs/${id}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get UI elements
export const getUI = () => {
    return new Promise((resolve, reject) => {
        get('/components/ui')
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get followed artists
export const getFollowedArtists = () => {
    return new Promise((resolve, reject) => {
        get('/me/following/artists')
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get followed venues
export const getFollowedVenues = () => {
    return new Promise((resolve, reject) => {
        get('/me/following/venues')
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Follow an artist
export const followArtist = (id) => {
    const data = { artist_id: id };
    return new Promise((resolve, reject) => {
        put('/me/following/artists', data)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Follow a venue
export const followVenue = (id) => {
    const data = { venue_id: id };
    return new Promise((resolve, reject) => {
        put('/me/following/venues', data)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Unfollow an artist
export const unfollowArtist = (id) => {
    return new Promise((resolve, reject) => {
        remove(`/me/following/artists/${id}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Unfollow a venue
export const unfollowVenue = (id) => {
    return new Promise((resolve, reject) => {
        remove(`/me/following/venues/${id}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Filter
export const filter = (data) => {
    return new Promise((resolve, reject) => {
        get('/components/map', {
            params: data
        })
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// send user's current location
export const sendUserLocation = (lat, lng) => {
    return new Promise((resolve, reject) => {
        put('me/current-location', {
            lat,
            lng
        })
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Search
export const search = (data) => {
    return new Promise((resolve, reject) => {
        get('/components/search', {
            params: data
        })
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get genres
export const getGenres = () => {
    return new Promise((resolve, reject) => {
        get('/genres')
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Sign up a listener account
export const signUpListener = (data) => {
    return new Promise((resolve, reject) => {
        post('new-user/listener', data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Edit profile
export const editProfile = (data) => {
    return new Promise((resolve, reject) => {
        put('me/profile-standard', data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Edit artist profile
export const editArtistProfile = (id, data) => {
    return new Promise((resolve, reject) => {
        put(`/artists/${id}`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Edit venue profile
export const editVenueProfile = (id, data) => {
    return new Promise((resolve, reject) => {
        put(`/venues/${id}`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Search bar
export const searchAll = (data) => {
    return new Promise((resolve, reject) => {
        get(`/components/search?query=${data}&query_type=full`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Change password
export const changePassword = (data) => {
    return new Promise((resolve, reject) => {
        put('me/password', data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Post feedback
export const feedback = (data) => {
    return new Promise((resolve, reject) => {
        post('feedback/beta-feedback', data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get notification settings
export const getNotificationSettings = () => {
    return new Promise((resolve, reject) => {
        get('notification-subscription')
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Update notification settings
export const updateNotification = (data, update) => {
    return new Promise((resolve, reject) => {
        put(`notification-subscription/${data.notification}/${data.method}`, update)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Add a genre to an artist
export const addGenre = (id, genre) => {
    return new Promise((resolve, reject) => {
        put(`artists/${id}/genres/${genre}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Remove a genre from an artist
export const removeGenre = (id, genre) => {
    return new Promise((resolve, reject) => {
        remove(`artists/${id}/genres/${genre}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get own account data for artist
export const getOwner = (id) => {
    return new Promise((resolve, reject) => {
        get(`artists/${id}/owner-profile`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get own account data for venue
export const getVenueOwner = (id) => {
    return new Promise((resolve, reject) => {
        get(`venues/${id}/owner-profile`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Change profile picture
export const changeUserPicture = (data) => {
    return new Promise((resolve, reject) => {
        post('media/listener/me/profile-picture', data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Change venue picture
export const changeVenuePicture = (id, data) => {
    return new Promise((resolve, reject) => {
        post(`media/venue/${id}/profile-picture`, data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Change artist picture
export const changeArtistPicture = (id, data) => {
    return new Promise((resolve, reject) => {
        post(`media/artist/${id}/profile-picture`, data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get a venues upcoming gigs
export const manageVenueUpcomingGigs = (id) => {
    return new Promise((resolve, reject) => {
        get(`venues/${id}/manage/upcoming-gigs`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get a venue's past gigs
export const manageVenuePastGigs = (id) => {
    return new Promise((resolve, reject) => {
        get(`venues/${id}/manage/past-gigs`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get an artist's upcoming gigs
export const manageArtistUpcomingGigs = (id) => {
    return new Promise((resolve, reject) => {
        get(`artists/${id}/manage/upcoming-gigs`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get an artist's past gigs
export const manageArtistPastGigs = (id) => {
    return new Promise((resolve, reject) => {
        get(`artists/${id}/manage/past-gigs`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getGigsTable = (
    startDate, days
) => {
    return new Promise((resolve, reject) => {
        get(`components/gig-table/?start_date=${startDate}&days_worth=${days}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Artist request a gig
export const requestGig = (id, data) => {
    return new Promise((resolve, reject) => {
        post(`artists/${id}/request-gig`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Venue add a gig
export const addGig = (id, data) => {
    return new Promise((resolve, reject) => {
        post(`venues/${id}/gigs`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Invite artist to Polynation
export const inviteArtist = (id, data) => {
    return new Promise((resolve, reject) => {
        post(`venues/${id}/invite-artist`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Edit a gig
export const editGig = (venueId, gigId, data) => {
    return new Promise((resolve, reject) => {
        put(`venues/${venueId}/gigs/${gigId}`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Artist request to edit gig
export const editGigRequest = (artistId, gigId, data) => {
    return new Promise((resolve, reject) => {
        post(`artists/${artistId}/gig-change-request/${gigId}`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get live gigs
export const getLiveGigs = (gigId, data) => {
    return new Promise((resolve, reject) => {
        get(`/gigs/${gigId}/stream?hack=${data}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
