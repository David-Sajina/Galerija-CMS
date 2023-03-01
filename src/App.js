import "./App.css";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import GalleryV from "./components/GalleryV";
import OneRow from "./components/OneRow";
import TocIcon from "@mui/icons-material/Toc";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import AddIcon from "@mui/icons-material/Add";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import React from "react";
import Button from "@mui/material/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import imageCompression from "browser-image-compression";

function App() {
	const [podaci, setPodaci] = useState([]);
	const [view, setView] = useState(true);
	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
	const [preview, setPreview] = useState();
	const [picName, setPicName] = useState("");
	const [desc, setDesc] = useState("");
	const [picNum, setPicNum] = useState();
	const [author, setAuthor] = useState("");
	const [beacon, setBeacon] = useState("");
	const [pic, setPic] = useState("");
	const [openAdd, setOpenAdd] = React.useState(false);
	const handleOpenAdd = () => setOpenAdd(true);
	const handleCloseAdd = () => {
		setOpenAdd(false);
		clearVariables();
	};
	const inputFile = useRef(null);
	const closeModal = useRef(null);
	const clearVariables = () => {
		setPicName("");
		setDesc("");
		setPicNum(null);
		setAuthor("");
		setBeacon("");
		setIsFilePicked(false);
		localStorage.clear();
		setPic("");
	};
	const refreshStuff = (e) => {
		if (Object.keys(e).length > 1) localUpdate(e);
		else localDelete(e);
	};
	const findIndex = async (e) => {
		for (let i = 0; i < podaci.length; i++) {
			if (podaci[i].ID === e.ID) {
				return i;
			}
		}
		return undefined;
	};
	const localDelete = async (e) => {
		let newArr = podaci.filter((obj) => obj.ID !== e.ID);
		sortData(newArr);
	};
	const localUpdate = async (e) => {
		let x = await findIndex(e);
		podaci[x].ImageAuthor = e.ImageAuthor;
		podaci[x].ImageDescription = e.ImageDescription;
		podaci[x].ImageNum = e.ImageNum;
		podaci[x].BeaconID = e.BeaconID;
		podaci[x].ImageTitle = e.ImageTitle;
		if (e.ImageBase64 !== "") {
			podaci[x].ImgPath = e.ImageBase64;
		}
		sortData(podaci);
	};
	const sortData = async (data) => {
		const sortedPodaci = data.sort((a, b) => {
			const imgNumA = parseInt(a.ImageNum);
			const imgNumB = parseInt(b.ImageNum);

			if (imgNumA < imgNumB) {
				return -1;
			}
			if (imgNumA > imgNumB) {
				return 1;
			}
			return 0;
		});
		setPodaci(sortedPodaci);
	};

	const getData = async () => {
		const podaci = await axios.get(
			`https://intersoft.uno/crm/M1WebServiceCRM.svc/v1/GallerySelect`
		);

		// Sortiranje
		sortData(podaci.data.Images);
	};
	const onInputClick = () => {
		// `current` points to the mounted file input element
		inputFile.current.click();
	};
	async function sendGallery() {
		let base64String = pic;
		let commaIndex = base64String.indexOf(",");
		let base64data = base64String.substring(commaIndex + 1);
		let unsortedData = [];
		try {
			const res = await axios.post(
				"https://intersoft.uno/crm/M1WebServiceCRM.svc/v1/GalleryInsert",
				{
					ImageTitle: picName,
					ImageAuthor: author,
					ImageDescription: desc,
					ImageNum: picNum,
					ImageBase64: base64data,
					BeaconID: beacon,
				}
			  );
		
			if (res.data.ResponseCode === "0") {
				let newPodaci = {
					ImgPath: pic,
					ID: res.data.ID,
					ImageTitle: picName,
					ImageDescription: desc,
					ImageNum: picNum,
					ImageAuthor: author,
					BeaconID: beacon,
				};
				unsortedData = podaci.concat(newPodaci);
				sortData(unsortedData);
				notify();
			} else notifyError();
		} catch (error) {
			console.log(error);
		}
	}async function resizeImageFn(event) {
		const imageFile = event.dataTransfer.files[0];

		const options = {
			maxSizeMB: 0.35,
			maxWidthOrHeight: 1200,
			useWebWorker: true,
		};
		try {
			const compressedFile = await imageCompression(imageFile, options);
			setSelectedFile(compressedFile);
			setIsFilePicked(true);
			const file = compressedFile;
			getBase64(file).then((base64) => {
				localStorage["fileBase64"] = base64;
				setPic(base64);
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

			setSelectedFile(compressedFile);
			setIsFilePicked(true);
			const file = compressedFile;
			getBase64(file).then((base64) => {
				localStorage["fileBase64"] = base64;
				setPic(base64);
			});
			changePreview(file); // write your own logic
		} catch (error) {
			console.log(error);
		}
	}
	const handleSubmit = (event) => {
		// 👇️ prevent page refresh
		event.preventDefault();
		sendGallery();
		clearVariables();
		handleCloseAdd();
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
	const notifyError = () => {
		toast.error("🦄 Something went wrong, try again!", {
			position: "top-center",
			autoClose: 5000,
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
		// 5MB
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
		getData();
		// eslint-disable-next-line
	}, []);

	return (
		<div>
			<div className="slice">
				<div className="alignTipka2">
					<button onClick={() => setView(!view)} className="viewTipka">
						{view && <TocIcon fontSize="large" className="img1size" />}
						{!view && <ViewQuiltIcon className="img2size" fontSize="large" />}
					</button>

					{/* ovdje staviti obicni modal */}

					<div>
						<button className="dodajTipka" onClick={handleOpenAdd}>
							<AddIcon fontSize="large" className="img1size" />
						</button>

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
											placeholder="Name of picture..."
											onChange={(event) => setPicName(event.target.value)}
										/>
										<hr />
										<textarea
											name="poruka"
											id="poruka"
											rows="5"
											className="textBoxModal"
											placeholder="Description of picture..."
											onChange={(event) => setDesc(event.target.value)}
										></textarea>

										<hr />
										<input
											type="number"
											name="num"
											id="num"
											className="textBoxModal"
											placeholder="Num of picture..."
											onChange={(event) => setPicNum(event.target.value)}
										/>
										<hr />
										<input
											type="text"
											name="author"
											id="author"
											className="textBoxModal"
											placeholder="Name of author..."
											onChange={(event) => setAuthor(event.target.value)}
										/>
										<hr />
										<input
											type="text"
											name="beaconid"
											id="beaconid"
											className="textBoxModal"
											placeholder="Beacon ID...."
											onChange={(event) => setBeacon(event.target.value)}
										/>

										<hr />

										{isFilePicked && preview ? (
											<div className="prew">
												<h2 style={{ textAlign: "center" }}>
													Preview of {selectedFile.name.substring(0, 60)}
												</h2>
												<img
													className="previewImage"
													src={preview}
													alt="preview"
												/>
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
											{picName && desc && picNum && author && pic && (
												<Button
													style={{ marginTop: "10px" }}
													className="removebtn"
													type="submit"
													variant="contained"
													color="success"
												>
													Submit
												</Button>
											)}
										</div>
										<br />
									</form>
								</div>
								<div className="actions"></div>
							</Box>
						</Modal>
					</div>

					{/* ovdje zavrsava modal */}

					<Popup modal nested>
						{(close) => (
							<div className="modal">
								<button className="close" onClick={close}>
									&times;
								</button>
								<div className="header">Insert new picture</div>
								<div className="content">
									{""}
									<form onSubmit={handleSubmit}>
										<input
											type="text"
											name="ip"
											id="ip"
											placeholder="Name of picture..."
											onChange={(event) => setPicName(event.target.value)}
										/>
										<hr />
										<textarea
											name="poruka"
											id="poruka"
											rows="5"
											placeholder="Description of picture..."
											onChange={(event) => setDesc(event.target.value)}
										></textarea>

										<hr />
										<input
											type="number"
											name="num"
											id="num"
											placeholder="Num of picture..."
											onChange={(event) => setPicNum(event.target.value)}
										/>
										<hr />
										<input
											type="text"
											name="author"
											id="author"
											placeholder="Name of author	.."
											onChange={(event) => setAuthor(event.target.value)}
										/>
										<hr />
										<input
											type="text"
											name="beaconid"
											id="beaconid"
											placeholder="Beacon ID...."
											onChange={(event) => setBeacon(event.target.value)}
										/>

										<hr />

										{isFilePicked && preview ? (
											<div className="prew">
												<h2 style={{ textAlign: "center" }}>
													Preview of {selectedFile.name.substring(0, 60)}
												</h2>
												<img
													className="previewImage"
													src={preview}
													alt="preview"
												/>
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
											{picName && desc && picNum && author && beacon && pic && (
												<Button
													style={{ marginTop: "10px" }}
													className="removebtn submitBtn"
													type="submit"
													variant="contained"
													color="success"
												>
													Submit
												</Button>
											)}
											<Button
												variant="contained"
												className="removebtn"
												ref={closeModal}
												onClick={() => {
													close();
												}}
											>
												close
											</Button>
										</div>
									</form>
								</div>
								<div className="actions"></div>
							</div>
						)}
					</Popup>
				</div>
			</div>
			<ToastContainer />
			{view && podaci && podaci.length > 0 && (
				<div className="backgroundOfG">
					{" "}
					<GalleryV podaci={podaci} prop={refreshStuff}></GalleryV>{" "}
				</div>
			)}
			{!view && podaci && podaci.length > 0 && (
				<OneRow podaci={podaci} prop={refreshStuff}></OneRow>
			)}
		</div>
	);
}

export default App;