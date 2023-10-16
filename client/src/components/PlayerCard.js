import Avatar, { genConfig } from "react-nice-avatar";

const PlayerCard = (props) => {
	const config = genConfig(props.player.avatar);
	return (
		<div
			className={`playerCard ${
				props.player.team === "BLUE" ? "blueTeamPlayer" : "redTeamPlayer"
			}`}
            data-testid="playerCardContent">
			<span className="playerAvatar" style={{ backgroundColor: config.bgColor, borderRadius: "5px 0 0 5px"}}>
				<Avatar
                    shape="rounded"
					className="playerAvatarElement"
					{...config}
				/>
			</span>
			<span className="playerName" title={props.player.playerId}>
				{props.player.username}
			</span>
		</div>
	);
};

export default PlayerCard;
