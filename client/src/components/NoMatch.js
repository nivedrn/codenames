import "../assets/css/nomatch.css";
import logo from "../assets/images/cn-icon.png";

const NoMatch = () => {
	return (
		<div data-testid="noMatchContent" className="noMatchContent">
        <img src={logo} alt="Logo" height="250" />
        <br/>
			<h1>&nbsp;&nbsp;&nbsp;Page not found</h1>
		</div>
	);
};

export default NoMatch;
