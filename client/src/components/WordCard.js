import React from "react";

const WordCard = (props) => {
	return (
		<div
			className={`wordCard ${
				props.isSpyMaster || props.isRevealed
					? "wordCard" + props.type
					: "wordCardNeutral"
			} ${
				props.isPlayerTurn && !props.isRevealed
					? props.currentTurn
						? "wordCardBlueTurn"
						: "wordCardRedTurn"
					: ""
			}            
            `}
            data-testid="wordCardContent" >
			<span className="wordCardInner">{props.word}</span>
			{props.isPlayerTurn && !props.isRevealed && (
				<>
                    { props.votes.length > 0 ? (<span className="wordCardVotes">{props.votes.length} Vote{ props.votes.length > 1 ? "s" : ""}</span>) : <span></span>}
                    <span></span>
					<span className="wordCardActions">
						{ !props.votes.includes(props.playerId) &&
                        (<span
							className="wordCardSuggest"
							onClick={() => props.wordCardAction(props.word, "VOTE")}
						>
							VOTE 
						</span>)}
						<span
							className="wordCardSelect"
							onClick={() => props.wordCardAction(props.word, "SELECT")}
						>
							SELECT
						</span>
					</span>
				</>
			)}
			{props.isSpyMaster && <>{props.type}</>}
		</div>
	);
};

export default WordCard;
