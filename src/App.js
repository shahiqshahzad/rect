import "./App.css";
import { useCallback, useEffect, useState } from "react";
import RectangleSelection from "react-rectangle-selection";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack5";
import { message } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";

import { Col, Row } from "react-bootstrap";

import editIcon from "./edit.png";
import tick from "./tick.png";
import cross from "./cross.png";
import axios from "axios";
import { PaginationControl } from "react-bootstrap-pagination-control";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {
  const [file, setFile] = useState("");
  const [showFile, setShowFile] = useState(null);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [change, setChange] = useState("");

  const [origin, setOrigin] = useState("");
  const [target, setTarget] = useState("");
  const [data, setData] = useState("");

  // fake data
  const axiosInstance = axios.create({
    baseURL: "https://pdf-to-html.stg.c85.de/",
    ContentType: "application/json",
  });
  const [all, setAll] = useState([
    {
      id: 1,
      title: "Document Title",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 2,
      title: "Document Reference",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 3,
      title: "Version Number",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 4,
      title: "Ratification Date",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 5,
      title: "Review Date",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 6,
      title: "Author",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 7,
      title: "Hospital /Location",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 8,
      title: "Approved By",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 9,
      title: "Document Type",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 10,
      title: "Related Documents",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 11,
      title: "Department",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 12,
      title: "Division",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
    {
      id: 13,
      title: "Care Group",
      descrition: "",
      origin: [],
      target: [],
      rect: [],
      pageNumber: "",
    },
  ]);
  const fileHanlder = async (e) => {
    setFile(e.target.files[0]);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    setShowFile(URL.createObjectURL(e.target.files[0]));
    await axiosInstance
      .post("uploadfile", formData)
      .then((res) => {
        message.success("file uploaded successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  // }
  const onDocumentLoadSuccess = useCallback(
    ({ numPages }) => {
      setNumPages(numPages);
    },
    [numPages]
  );
  // submit Handler
  const submitHandler = async () => {
    if (origin.length === 0) {
      message.error("please Select Coordinates");
    } else {
      const index = all.findIndex((d) => d.id === data.id);
      const previousData = all;
      const rectAry = [origin[0], origin[1], target[0], target[1]];
      const rectData = new FormData();
      rectData.append("filename", file.name);
      rectData.append("rect", JSON.stringify(rectAry));
      rectData.append("page", pageNumber);
      await axiosInstance.post("getrect", rectData).then((res) => {
        previousData[index] = {
          id: data.id,
          title: data.title,
          descrition: res.data.text,
          origin: origin,
          target: target,
          rect: [origin[0], origin[1], target[0], target[1]],
          pageNumber: pageNumber,
        };
        setAll(previousData);
        console.log(previousData);
        // console.log(checkFile);
        console.log([origin[0], origin[1], target[0], target[1]]);
      });
      message.success("update successfully");
      setData("");
      setOrigin([]);
      setTarget([]);
    }
  };
  const initliazeHandler = (d) => {
    console.log(d);
    setData(d);
    console.log(d.pageNumber);
    if (d.pageNumber !== "") {
      setPageNumber(d.pageNumber);
    }
    setTarget(d.target);
    setOrigin(d.origin);
  };

  return (
    <>
      <Row>
        <Col>
          {showFile === null ? (
            <input type="file" onChange={(e) => fileHanlder(e)} />
          ) : (
            <>
              <RectangleSelection
                onSelect={(e, coords) => {
                  setOrigin(coords.origin);
                  setTarget(coords.target);
                }}
                style={{
                  backgroundColor: "none",
                  border: "2px solid black",
                  style: "absolute",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "relative ",
                  }}
                >
                  <Document
                    file={showFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>

                  <div
                    style={{
                      backgroundColor: "none",
                      border: `2px solid black`,
                      position: "absolute",
                      top: `${origin[1]}px`,
                      left: `${origin[0]}px`,
                      height: `${target[1] - origin[1]}px`,
                      width: `${target[0] - origin[0]}px`,
                    }}
                  ></div>
                  {data ? (
                    <div
                      style={{
                        backgroundColor: "none",
                        border: `1px solid black`,
                        position: "absolute",
                        top: `${origin[1]}px`,
                        left: `${origin[0]}px`,
                        height: `${target[1] - origin[1]}px`,
                        width: `${target[0] - origin[0]}px`,
                      }}
                    ></div>
                  ) : null}
                </div>
              </RectangleSelection>
              {/* <p>
                Page {pageNumber} of {numPages}
              </p>
              <div onClick={() => setPageNumber((prev) => prev + 1)}>
                change
              </div> */}
            </>
          )}
        </Col>
        <Col
          md={6}
          className="mt-5"
          style={{ height: "100vh", overflowX: "scroll" }}
        >
          {all.map((d) => (
            <div
              style={
                d.id === data.id
                  ? {
                      backgroundColor: "#F7F8FB",
                      border: "3px solid #EEBF40",
                    }
                  : { backgroundColor: "#F7F8FB" }
              }
              className="d-flex justify-content-between align-items-center mt-4 p-3"
            >
              <div>
                <label className="fw-bold"> {d.title} :</label>
                {d.descrition ? (
                  <label className="ps-2">{d.descrition}</label>
                ) : (
                  <>
                    <label
                      style={{
                        color: "red",
                        padding: "2px",
                      }}
                      className="ms-2"
                    >
                      [not-selected]
                    </label>
                  </>
                )}
              </div>
              <div>
                {d.id !== data.id ? (
                  <img
                    src={editIcon}
                    alt="edit"
                    height={"22px"}
                    className="cursor"
                    onClick={() => initliazeHandler(d)}
                  />
                ) : data.id === d.id ? (
                  <>
                    <div className="d-flex">
                      <img
                        src={tick}
                        alt="tick"
                        height={"25px"}
                        className="cursor"
                        onClick={() => {
                          submitHandler();
                        }}
                      />
                      <img
                        src={cross}
                        alt="cross"
                        height={"25px"}
                        className="px-2 cursor"
                        onClick={() => setData("")}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </Col>
      </Row>
      <div className="d-flex justify-content-center">
        <PaginationControl
          page={pageNumber}
          between={4}
          total={numPages}
          limit={1}
          changePage={(page) => {
            // setPage(page);
            console.log(page);
            setPageNumber(page);
          }}
          ellipsis={1}
        />
      </div>
    </>
  );
}

export default App;
