import * as React from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageCompression from "browser-image-compression";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import "../App.css";
import axios from "axios";
const Forma = ({ data, callback, refresh }) => {
	const handleRefresh = (updatedData) => {
		refresh(updatedData);
	};
	const handleCloseAdd = () => {
		sendBackData();
	};
	const sendBackData = () => {
		callback(false);
	};

	const [isFilePicked, setIsFilePicked] = useState(true);
	const [preview, setPreview] = useState();
	const [picName, setPicName] = useState("");
	const [desc, setDesc] = useState("");
	const [picNum, setPicNum] = useState(0);
	const [author, setAuthor] = useState("");
	const [beacon, setBeacon] = useState("");
	const [pic, setPic] = useState("");

	const [picName1, setPicName1] = useState("");
	const [desc1, setDesc1] = useState("");
	const [picNum1, setPicNum1] = useState(0);
	const [author1, setAuthor1] = useState("");
	const [, setBeacon1] = useState("");
	const [pic1, setPic1] = useState("");
	const [openAdd] = React.useState(true);
	const inputFile = useRef(null);

	const onInputClick = () => {
		// `current` points to the mounted file input element
		inputFile.current.click();
	};

	async function resizeImageFn(event) {
		const imageFile = event.dataTransfer.files[0];

		const options = {
			maxSizeMB: 0.35,
			maxWidthOrHeight: 1200,
			useWebWorker: true,
		};
		try {
			const compressedFile = await imageCompression(imageFile, options);
			setIsFilePicked(true);
			const file = compressedFile;
			getBase64(file).then((base64) => {
				localStorage["fileBase64"] = base64;
				setPic(base64);
				// base64 set
			});
			changePreview(file); // write your own logic
		} catch (error) {
			console.log(error);
		}
	}
	async function resizeImageFnT(event) {
		const imageFile = event.target.files[0];

		const options = {
			maxSizeMB: 0.35,
			maxWidthOrHeight: 1200,
			useWebWorker: true,
		};
		try {
			const compressedFile = await imageCompression(imageFile, options);
			setIsFilePicked(true);
			const file = compressedFile;
			getBase64(file).then((base64) => {
				localStorage["fileBase64"] = base64;
				setPic(base64);
				// base64 set
			});
			changePreview(file); // write your own logic
		} catch (error) {
			console.log(error);
		}
	}
	const handleSubmit = (event) => {
		// 👇️ prevent page refresh
		event.preventDefault();

		// Function runs if there are any changes!
		// Runs if new picture is inserted!
		if (pic !== pic1 && pic !== "") {
			// Send everything with pic being base64 pic
			apdejtaj();
		} else {
			// Send everything with pic being pic = "null"
			setPic("");
			apdejtaj();
		}

		// Clearing!
		setPicName("");
		setDesc("");
		setPicNum(null);
		setAuthor("");
		setBeacon("");
		setIsFilePicked(false);
		localStorage.clear();
		setPic("");
		handleCloseAdd();
		notify();
	};
	const notify = () => {
		toast.success("🦄 Image submitted sucessfuly", {
			position: "top-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
	};
	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
			reader.readAsDataURL(file);
		});
	};

	const changePreview = (s) => {
		const objectUrl = URL.createObjectURL(s);
		setPreview(objectUrl);
	};

	const dragOver = (e) => {
		e.preventDefault();
	};
	const dragEnter = (e) => {
		e.preventDefault();
	};

	const dragLeave = (e) => {
		e.preventDefault();
	};
	const checkSize = (e) => {
		// 5MB
		if (e.target.files[0].size > 5242880) return false;
		else return true;
	};
	const checkSizeD = (e) => {
		// Max picture size 5MB
		if (e.dataTransfer.files[0].size > 5242880) return false;
		else return true;
	};
	const changeHandler = (e) => {
		if (checkSize(e)) {
			resizeImageFnT(e);
		} else {
			toast.error("Image size is too big", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
	};
	const fileDrop = (e) => {
		e.preventDefault();
		if (checkSizeD(e)) resizeImageFn(e);
		else {
			toast.error("Image size is too big", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
	};
	useEffect(() => {
		setPreview(data.ImgPath);
		setPicName(data.ImageTitle);
		setDesc(data.ImageDescription);
		setPicNum(data.ImageNum);
		setAuthor(data.ImageAuthor);
		setBeacon(data.BeaconID);
		setPic(data.ImgPath);

		setPicName1(data.ImageTitle);
		setDesc1(data.ImageDescription);
		setPicNum1(data.ImageNum);
		setAuthor1(data.ImageAuthor);
		setBeacon1(data.BeaconID);
		setPic1(data.ImgPath);
	}, [data]);

	const deletePicture = async () => {
		try {
			const rez = await axios.post(
				"https://intersoft.uno/crm/M1WebServiceCRM.svc/v1/GalleryDelete",
				{
				  ID: data.ID,
				}
				
			  );
			console.log("rez", rez.data);

			handleCloseAdd();
			handleRefresh({ ID: data.ID });
		} catch (error) {
			console.log(error);
		}
	};

	const apdejtaj = async () => {
		let x = "";
		let x1 = "";
		if (pic === pic1) {
			x = "";
			x1 = "";
		} else {
			x1 = pic;
			let base64String = pic;
			let commaIndex = base64String.indexOf(",");
			let base64data = base64String.substring(commaIndex + 1);
			x = base64data;
		}
		let updatedData = {
			ImageTitle: picName,
			ImageAuthor: author,
			ImageDescription: desc,
			ImageNum: picNum,
			ImageBase64: x1,
			BeaconID: beacon,
			ID: data.ID,
		};
		handleRefresh(updatedData);
		try {

	let xif;

    if (x == "") {
		xif = {
        ImageTitle: picName,
        ImageAuthor: author,
        ImageDescription: desc,
        ImageNum: picNum,
        BeaconID: beacon,
        ID: data.ID,
      };
    } else {
		xif = {
        ImageTitle: picName,
        ImageAuthor: author,
        ImageDescription: desc,
        ImageNum: picNum,
        ImageBase64: x,
        BeaconID: beacon,
        ID: data.ID,
      };
    }

    const rez = await axios.post(
      "https://intersoft.uno/crm/M1WebServiceCRM.svc/v1/GalleryUpdate",
      xif
    );

			
			console.log("rez", rez.data);
			handleCloseAdd();
		} catch (error) {
			console.log(error);
		}
	};

return (
		<div>
			<Modal
				open={openAdd}
				onClose={handleCloseAdd}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				className="modalAddBody"
				style={{ overflow: "scroll" }}
			>
				<Box className="modalAdd">
					<div className="content">
						{""}
						<form onSubmit={handleSubmit}>
							<input
								type="text"
								name="ip"
								id="ip"
								className="textBoxModal"
								defaultValue={data.ImageTitle}
								placeholder="Name of picture..."
								onChange={(event) => {
									setPicName(event.target.value);
								}}
							/>
							<hr />
							<textarea
								name="poruka"
								id="poruka"
								rows="5"
								className="textBoxModal"
								defaultValue={data.ImageDescription}
								placeholder="Description of picture..."
								onChange={(event) => setDesc(event.target.value)}
							></textarea>

							<hr />
							<input
								type="number"
								name="num"
								id="num"
								defaultValue={data.ImageNum}
								className="textBoxModal"
								placeholder="Num of picture..."
								onChange={(event) => {
									setPicNum(parseInt(event.target.value, 10));
								}}
							/>
							<hr />
							<input
								type="text"
								name="author"
								id="author"
								className="textBoxModal"
								defaultValue={data.ImageAuthor}
								placeholder="Name of author..."
								onChange={(event) => setAuthor(event.target.value)}
							/>
							<hr />
							<input
								type="text"
								name="beaconid"
								id="beaconid"
								className="textBoxModal"
								defaultValue={data.BeaconID}
								placeholder="Beacon ID...."
								onChange={(event) => setBeacon(event.target.value)}
							/>

							<hr />

							{isFilePicked && preview ? (
								<div className="prew">
									<h2 style={{ textAlign: "center" }}>Preview of</h2>
									<img className="previewImage" src={preview} alt="preview" />
									<Button
										className="removebtn"
										onClick={() => {
											setIsFilePicked(false);
											localStorage.clear();
											setPic("");
										}}
										variant="outlined"
										color="error"
									>
										Remove picture
									</Button>
								</div>
							) : (
								<p>Drag & drop a file or click inside the file box</p>
							)}
							{!isFilePicked && (
								<div className="droparea">
									<div className="containerUpload">
										<div
											className="drop-container"
											onClick={onInputClick}
											onDragOver={dragOver}
											onDragEnter={dragEnter}
											onDragLeave={dragLeave}
											onDrop={fileDrop}
										>
											<div className="drop-message">
												<div className="upload-icon"></div>
												DRAG & DROP <br></br>
												OR CLICK IN THE AREA
												{!isFilePicked && (
													<input
														onChange={changeHandler}
														type="file"
														id="file"
														ref={inputFile}
														style={{ display: "none" }}
													/>
												)}
											</div>
										</div>
									</div>
								</div>
							)}

							<div>
								{(picName !== picName1 ||
									desc !== desc1 ||
									picNum !== picNum1 ||
									author !== author1 ||
									(pic !== pic1 && pic !== "")) && (
									<Button
										style={{ marginTop: "10px" }}
										className="removebtn"
										type="submit"
										variant="contained"
										color="success"
									>
										SUBMIT CHANGES
									</Button>
								)}
								<Button
									style={{ marginTop: "10px" }}
									className="removebtn"
									type="button"
									onClick={deletePicture}
									variant="contained"
									color="error"
								>
									DELETE
								</Button>
							</div>
							<br />
						</form>
					</div>
					<div className="actions"></div>
				</Box>
			</Modal>
		</div>
	);
};
export default Forma;