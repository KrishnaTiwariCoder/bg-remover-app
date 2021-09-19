import "./App.css";
import { useState } from "react";
import axios from "axios";
import path from "path";
var Loader = require("react-loader");

function App() {
  const [image, setImage] = useState(
    "https://i.insider.com/5484d9d1eab8ea3017b17e29?width=600&format=jpeg&auto=webp"
  );
  const [bgRemovedImage, setBgRemovedImage] = useState(
    "https://i.imgur.com/SF640xT.png"
  );

  const [loading, setLoading] = useState(false);

  const uploadFile = (e) => {
    if (localStorage.getItem("used")) {
      return alert("You can only use it once !!");
    }
    setLoading(true);
    const file = e.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setImage(fileReader.result);
    };

    const inputPath = path.join("/src/uploads");

    const formData = new FormData();

    formData.append("size", "auto");
    formData.append("image_file", file, inputPath);

    axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: formData,
      responseType: "arraybuffer",
      headers: {
        "X-Api-Key": process.env.REACT_APP_BG_REMOVER_API_KEY,
      },
      encoding: null,
    })
      .then((response) => {
        if (response.status !== 200) {
          return console.error("Error:", response.status, response.statusText);
        }
        localStorage.setItem("used", true);
        const arrayBufferView = new Uint8Array(response.data);
        const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);
        setBgRemovedImage(imageUrl);
        setLoading(false);
      })
      .catch((error) => {
        return console.error("Request failed:", error);
      });
  };
  if (loading) {
    return (
      <Loader
        loaded={false}
        lines={13}
        length={20}
        width={10}
        radius={30}
        corners={1}
        rotate={0}
        direction={1}
        color="#000"
        speed={1}
        trail={60}
        shadow={false}
        hwaccel={false}
        className="spinner"
        zIndex={2e9}
        top="50%"
        left="50%"
        scale={1.0}
        loadedClassName="loadedContent"
      />
    );
  }

  return (
    <div className="app">
      <div className="app__body">
        <div className="heading">
          <h1>Upload file</h1>
          <h1>Output image</h1>
        </div>
        <hr />
        <div className="images">
          <label>
            <input type="file" onChange={uploadFile} />
            <img src={image} alt="file" />
          </label>
          <img
            src={bgRemovedImage}
            alt="bgremoved"
            style={{ width: "600px" }}
          />
        </div>
        <div className="btn">
          <a href={bgRemovedImage} download>
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
