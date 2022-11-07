import { useState } from "react";
import * as React from "react";
import CardFlip from "./CardFlip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import "../index.css";

const GalleryView = ({ podaci }) => {
	const [poredak, setPoredak] = useState(4);

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const modalStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "auto",
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};
	return (
		<div>
			<Grid container spacing={1}>
				{podaci.map((person) => (
					<Grid key={person.id} lg={4} md={4} item>
						<Box display="flex" flexDirection="column" alignItems="center">
							<p>{person.Name}</p>

							<img
								className="imageGallery"
								onClick={handleOpen}
								src={person.src}
								alt="IMG DIDNT LOAD"
							/>
						</Box>
					</Grid>
				))}
			</Grid>

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={modalStyle}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Text in a modal
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
					</Typography>
					<div display="flex" align="center">
						<CardFlip />
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default GalleryView;
