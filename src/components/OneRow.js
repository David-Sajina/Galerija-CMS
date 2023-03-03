import { useState, useEffect, useRef } from "react";
import * as React from "react";
import CardFlip from "./CardFlip";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "../App.css";
import { Create } from "@mui/icons-material";
import Forma from "./Forma";

const OneRow = ({ podaci, prop, loadin }) => {
	const [slika, setSlika] = useState([]);
	const [data1, setData1] = useState([]);
	const [rowData, setData] = useState([]);
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [hcomponent, setHcomponent] = useState(false);
	const reval = () => {
		setHcomponent(false);
	};
	const load = () =>{
		loadin(true);
		handleClose();
		setHcomponent(false);
	}
	const revalue = async (e) => {
		setHcomponent(false);
		await prop(e);
	};
	useEffect(() => {
		setData(podaci);
	}, [podaci]);
	return (
		<div>
			{rowData.map((data) => (
				<div className="gridInlineFather" key={data.ID}>
					<div className="gridInlineChild1">
						<Box display="flex" flexDirection="column" alignItems="center">
							<img
								className="imageInline"
								onClick={() => {
									handleOpen();
									setSlika(data);
								}}
								src={data.ImgPath}
								alt="IMG DIDNT LOAD"
								style={{ marginBottom: "8px" }}
							/>
						</Box>
					</div>
					<div className="gridInlineChild2">
						<div className="containContainContain">
							<div className="containContain">
								<div className="naslovBijeli"> Art name: </div>
								<div className="contain">
									<p> {data.ImageTitle}</p>
								</div>
							</div>
							<div className="containContai">
								<div className="naslovbutton">
									<button
										className="editButton"
										onClick={() => {
											setHcomponent(true);
											setData1(data);
										}}
									>
										<Create fontSize="xs" />
										&nbsp;EDIT
									</button>
								</div>
							</div>
							<div className="containContain">
								<div className="naslovBijeli2"> Author: </div>
								<div className="contain2">
									<p> {data.ImageAuthor}</p>
							
								</div>
							</div>
						</div>
						<div className="containContain">
							<div className="naslovBijeliDesc">Description: </div>
							<div className="containDesc">
								<p> {data.ImageDescription}</p>
							</div>
						</div>
					</div>
				</div>
			))}

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				disableAutoFocus={true}
			>
				<Box className="modalBody">
					<div className="alignCardFlip">
						<CardFlip podaci={slika} callback={revalue} load={load} />
					</div>
				</Box>
			</Modal>
			{hcomponent && (
				<Forma data={data1} callback={reval} refresh={revalue} loadin={load}></Forma>
			)}
		</div>
	);
};

export default OneRow;