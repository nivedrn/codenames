import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_REGISTER_FAIL,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	USER_LIST_REQUEST,
	USER_LIST_SUCCESS,
	USER_LIST_FAIL,
	USER_UPDATE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
} from "../constants/userConstants";
import {SERVER_HOST} from "../constants/apiConstants";

export const login = (email, password) => async (dispatch) => {
	try {
		dispatch({ type: USER_LOGIN_REQUEST });

		const config = {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		};

		const response = await fetch(SERVER_HOST + "/users/login", config);
		const data = await response.json();

		dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

		localStorage.setItem("userInfo", JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const logout = () => async (dispatch) => {
	localStorage.removeItem("userInfo");
	dispatch({ type: USER_LOGOUT });
};

export const guestUser = (guestName, pic) => async (dispatch) => {
	let data = {
		_id: "Guest_" + guestName,
		name: guestName,
		email: "",
		isAdmin: false,
		isGuest: true,
		pic: pic,
	};
	sessionStorage.setItem("userInfo", JSON.stringify(data));
	dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
};

export const register = (name, email, password, pic) => async (dispatch) => {
	try {
		dispatch({ type: USER_REGISTER_REQUEST });

		const config = {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({ name, email, password, pic }),
		};

		const response = await fetch(SERVER_HOST + "/users", config);
		const data = await response.json();

		dispatch({ type: USER_REGISTER_SUCCESS, payload: data });

		dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
		console.log("user is reaching register action");
		localStorage.setItem("userInfo", JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: USER_REGISTER_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const listUsers = (searchTerm = "", pageNumber = 1, itemsPerPage = 10) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_LIST_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const response = await fetch(SERVER_HOST + '/users/fetchUsers?search=' + searchTerm + '&page=' + pageNumber + '&itemsPerPage=' + itemsPerPage, config);
		const data = await response.json();

		dispatch({
			type: USER_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({
			type: USER_LIST_FAIL,
			payload: message,
		});
	}
};


  export const updateProfile = (user) => (dispatch, getState) => {
	dispatch({ type: USER_UPDATE_REQUEST });
	
	const {
	  userLogin: { userInfo },
	} = getState();
  
	fetch(SERVER_HOST + "/users/update", {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${userInfo.token}`,
	  },
	  body: JSON.stringify(user)
	})
	.then(res => res.json())
	.then(data => {
	  dispatch({ type: USER_UPDATE_SUCCESS, payload: data });  
	  localStorage.setItem("userInfo", JSON.stringify(data));
	})
	.catch(error => {
	  dispatch({
		type: USER_UPDATE_FAIL,
		payload:
		  error.response && error.response.data.message
			? error.response.data.message
			: error.message,
	  });
	});
  };