// 기본 설정
const express = require("express");
const app = express();
const PORT = 3000;
const axios = require("axios");
const cors = require("cors");
const sharp = require("sharp");

const { xml2json } = require("xml-js");
const { decode } = require("iconv-lite");

app.use(express.json());
app.use(express.static(__dirname));
app.use(cors());

const allowedOrigins = [
  "https://3ab5ce40-cc01-46a3-bcc0-ec7bed99e490-00-7rwwl81fqpq4.riker.replit.dev",
  "https://8933f837-e4f0-462a-b9b1-5e5b5e7b3466-00-twldkfljwvji.janeway.replit.dev",
  "https://shopping.ournicerver.com",
  "https://ournicerver.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("I didn't allow CORS for U~ Just buzz off then"));
    }
  },
};

// 라우팅 정의
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/search.html");
});

app.all("/image_11st", async (req, res) => {
  if (req.query?.link == undefined) throw new Error("Image link not provided");
  let { data } = await axios(`https://cdn.011st.com/${req.query?.link}`, {
    responseType: "arraybuffer",
  });
  const resizedImageBuffer = await sharp(data).resize(720, 680).toBuffer();
  res.writeHead(200, { "Content-Type": "image/jpeg" }).end(resizedImageBuffer);
});

app.all("/image_naver", async (req, res) => {
  if (req.query?.link == undefined) throw new Error("Image link not provided");
  let { data } = await axios(`https://shopping-phinf.pstatic.net/${req.query?.link}`,{ responseType: "arraybuffer" });
  const resizedImageBuffer = await sharp(data).resize(640, 480).toBuffer();
  res.writeHead(200, { "Content-Type": "image/jpeg" }).end(resizedImageBuffer);
});

app.options("/11st", cors(corsOptions));
app.post("/11st", async (req, res) => {
  if (req?.body?.keyword == undefined) return res.json({ message: "요청 body에 키워드가 존재하지 않습니다." });
  const { data } = await axios({url: `https://openapi.11st.co.kr/openapi/OpenApiService.tmall?key=${process.env['ST11_Client_Secret']}&apiCode=ProductSearch&pageSize=48&keyword=${encodeURI(req?.body?.keyword,)}`, responseType: "arraybuffer", method: "GET"});
  res.json(JSON.parse(xml2json(decode(data, "EUC-KR").toString(), { compact: true })).ProductSearchResponse.Products,
  );
});

app.options("/typo", cors(corsOptions));
app.post("/typo", async (req, res) => {
  if (req?.body?.keyword == undefined) return res.json({ message: "요청 body에 키워드가 존재하지 않습니다." });
  try {
    const { data } = await axios({url: `https://openapi.naver.com/v1/search/errata.json?query=${encodeURI(req?.body?.keyword,)}`,method: "GET", headers: {"X-Naver-Client-Id": process.env['Naver_Client_ID'],"X-Naver-Client-Secret": process.env['Naver_Client_Secret']}});
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다.", error: error });
  }
});

app.options("/naver", cors(corsOptions));
app.post("/naver", async (req, res) => {
  if (req?.body?.keyword == undefined) return res.json({ message: "요청 body에 키워드가 존재하지 않습니다." });
  try {
    const { data } = await axios({url: `https://openapi.naver.com/v1/search/shop.xml?query=${encodeURI(req?.body?.keyword)}&display=48&start=1&sort=sim`, method: "GET", headers: {"X-Naver-Client-Id": process.env['Naver_Client_ID'], "X-Naver-Client-Secret": process.env['Naver_Client_Secret']}});
    res.json(JSON.parse(xml2json(data, { compact: true })));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다.", error: error });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(
    `${PORT} Port에서 Shopping_EnMirynet 서버가 정상 LISTEN중입니다.`,
  );
});
