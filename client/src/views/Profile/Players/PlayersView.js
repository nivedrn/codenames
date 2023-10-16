import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listUsers } from "../../../actions/userAction";

const PlayersView = (props) => {
	const dispatch = useDispatch();
	const userList = useSelector((state) => state.userList);

	let [searchTerm, setSearchTerm] = useState("");
	let [pageNumber, setPageNumber] = useState(1);
	let [itemsPerPage, setItemsPerPage] = useState(5);
	let [hasNext, setHasNext] = useState(true);
	let [hasPrev, setHasPrev] = useState(false);

	useEffect(() => {
		dispatch(listUsers(searchTerm, pageNumber, itemsPerPage));

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
        if (userList.users !== null && userList.users !== undefined) {
		    dispatch(listUsers(searchTerm, pageNumber, itemsPerPage));
        }
		// eslint-disable-next-line
	}, [searchTerm, pageNumber, itemsPerPage]);

	useEffect(() => {

		if (userList.users !== null && userList.users !== undefined) {
			if ("next" in userList.users) {
				if (pageNumber === userList.users.next) {
					setHasNext(false);
				} else {
					setHasNext(true);
				}
			}

			if ("prev" in userList.users) {
				if (userList.users.prev === 1 && pageNumber === 1) {
					setHasPrev(false);
				} else {
					setHasPrev(true);
				}
			}
            console.log(userList.users);
		}

		// eslint-disable-next-line
	}, [userList]);

	function handleChange(e) {
		if (e.target.id === "searchPlayerInput") {
			if (e.target.value.length >= 0) {
				setPageNumber(1);
				setSearchTerm(e.target.value);
			}
		} else if (e.target.id === "prevPageButton") {
			if (pageNumber !== userList.users.prev) {
				setPageNumber(userList.users.prev);
			}
		} else if (e.target.id === "nextPageButton") {
			if (pageNumber !== userList.users.next) {
				setPageNumber(userList.users.next);
			}
		}
	}

	return (
		<div className="players_table">
			<input
				type="text"
				id="searchPlayerInput"
				className="authGuestSearchInput"
				onChange={handleChange}
				placeholder="search users by name, email or role ..."
				autoComplete="off"
			/>
			<span className="playerTableActions">
				<button
					id="prevPageButton"
					onClick={handleChange}
					className="gameActionButton"
					disabled={!hasPrev}
				>
					Prev
				</button>
				<button
					id="nextPageButton"
					onClick={handleChange}
					className="gameActionButton"
					disabled={!hasNext}
				>
					Next
				</button>
			</span>
			<table className="players_table_data">
				<thead>
					<tr>
						<th>Id</th>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
                    
					{userList.users !== null &&
						userList.users !== undefined &&
						userList.users.data.map((row, index) => {
							return (
								<tr key={index}>
									<td>{row["_id"]}</td>
									<td>{row["name"]}</td>
									<td>{row["email"]}</td>
									<td>{row["role"]}</td>
									<th>
										<button className="gameActionButton">Block User</button>
									</th>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
};

export default PlayersView;
