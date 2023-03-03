import ReactCardFlip from "react-card-flip";
import { useState } from "react";
import "../App.css";
import { Create } from "@mui/icons-material";
import Forma from "./Forma";
const CardFlip = ({ podaci, callback, load }) => {
	const [isFlipped] = useState(true);
	const [hcomponent, setHcomponent] = useState(false);
	const loading = () => {
		load(true)
	}
	const val = (e) => {
		callback(e);
	};
	const revalue = (e) => {
		setHcomponent(false);
	};

	return (
		<ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
			<div className="positionFlip">
				<div className="containContainContain">
					<div className="containNA">
						<div className="naslovBijeliModalLeft">title:</div>
						<div className="containFlip">{podaci.ImageTitle}</div>
					</div>
					<div className="containNA">
						<div className="naslovBijeliModalRight">Author:</div>
						<div className="containFlipLeft">{podaci.ImageAuthor}</div>
					</div>
				</div>
				<div className="naslovBijeliModalDesc">Description:</div>
				<div className="containLarge">{podaci.ImageDescription}</div>
			</div>

			<div className="back">
				<img
					className="alignSlikaModal"
					style={{ height: "600px" }}
					alt="pic"
					src={podaci.ImgPath}
				/>
				&nbsp;
				<button
					className="editButton"
					style={{
						marginTop: "8px",
						marginBottom: "-40px",
						margin: "0 auto",
						jutifyContent: "center",
						alignItems: "center",
						display: "block",
					}}
					onClick={() => {
						setHcomponent(true);
					}}
				>
					<Create fontSize="xs" />
					&nbsp;EDIT
				</button>
				{hcomponent && (
					<Forma data={podaci} callback={revalue} refresh={val} loadin={loading}></Forma>
				)}
			</div>
		</ReactCardFlip>
	);
};

export default CardFlip;