import { useState, useEffect } from "react";
import * as React from "react";
import CardFlip from "./CardFlip";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "../App.css";

const GalleryV = ({ podaci, prop, loadin }) => {
	const [open, setOpen] = useState(false);
	const [slika, setSlika] = useState([]);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const loading = () => {
		loadin(true);
		handleClose();
	}
	const refresh = (e) => {
		prop(e);
	};
	const [brojac, setBrojac] = useState(0);
	const x = 5;
	const y = 10;
	useEffect(() => {
		setBrojac(Math.ceil(podaci.length / 5));
	}, [podaci]);

	return (
		<div>
			{[...Array(brojac)].map((i, index) => (
				<div
					className={(index + 1) % 2 === 0 ? "containerflip" : "container"}
					key={String(index + 1)}
				>
					{podaci
						.slice(x * (index + 1) - 5, y * (index + 1) - (index + 1) * 5)
						.map((person) => (
							<div key={person.ID}>
								<img
									onClick={() => {
										handleOpen();
										setSlika(person);
									}}
									src={person.ImgPath}
									alt=""
								/>
							</div>
						))}
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
						<CardFlip podaci={slika} callback={refresh} load={loading} />
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default GalleryV;
