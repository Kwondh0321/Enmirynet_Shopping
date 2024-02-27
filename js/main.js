const TOP = document.getElementById("TOP");
const Image_11st = "/image_11st?link=";
const Image_Naver = "/image_naver?link=";
const hasSearched = {
  st11: 0
};
// aliexpress : https://openservice.aliexpress.com/doc/api.htm?spm=a2o9m.11193494.0.0.35db2b90YT3YR2#/api?cid=21038&path=aliexpress.ds.recommend.feed.get&methodType=GET/POST

function issearchdev(search_data) {
  const developers = ["도혁", "동영", "유익", "은성", "우혁"];
	return developers.some((data) => search_data.includes(data));
}

function displayResult() {
  var shoppingDataContainer = document.getElementById("shopping_company");
  shoppingDataContainer.innerHTML = `
			<ul class="nav nav-pills d-inline-flex text-center mb-5">
				<li class="nav-item">
					<a class="d-flex m-2 py-2 bg-light rounded-pill active" data-bs-toggle="pill" href="#tab-1" onclick="addButton_additional('naver', document.getElementById('product_item').textContent);">
						<span class="text-dark" style="width: 130px;">네이버쇼핑</span>
					</a>
				</li>
				<li class="nav-item">
					<a class="d-flex py-2 m-2 bg-light rounded-pill" data-bs-toggle="pill" href="#tab-2" onclick="search11st(document.getElementById('input_keyword').value); addButton_additional('st11', document.getElementById('product_item').textContent);">
						<span class="text-dark" style="width: 130px;">11번가</span>
					</a>
				</li>
				<li class="nav-item">
					<a class="d-flex m-2 py-2 bg-light rounded-pill" data-bs-toggle="pill" href="#tab-3">
						<span class="text-dark" style="width: 130px;">쇼핑몰2</span>
					</a>
				</li>
				<li class="nav-item">
					<a class="d-flex m-2 py-2 bg-light rounded-pill" data-bs-toggle="pill" href="#tab-4">
						<span class="text-dark" style="width: 130px;">쇼핑몰3</span>
					</a>
				</li>
				<li class="nav-item">
					<a class="d-flex m-2 py-2 bg-light rounded-pill" data-bs-toggle="pill" href="#tab-5">
						<span class="text-dark" style="width: 130px;">쇼핑몰4</span>
					</a>
				</li>
			</ul>
    `;
}

function convertScore(originalScore) {
  const maxScore = 100;
  const newMaxScore = 5;
  const convertedScore = (originalScore / maxScore) * newMaxScore;
  return convertedScore.toFixed(1);
}

function truncateText(text, maxLength) {
  var textWithoutSpaces = text.replace(/\s+/g, "");
  if (textWithoutSpaces.length <= maxLength) {
    return text;
  } else {
    var truncatedTextWithoutSpaces = textWithoutSpaces.slice(0, maxLength);
    var restoredText = "";
    var originalIndex = 0;
    for (var i = 0; i < truncatedTextWithoutSpaces.length; i++) {
      if (originalIndex < text.length && text[originalIndex] === " ") {
        restoredText += " ";
        originalIndex++;
      }
      restoredText += truncatedTextWithoutSpaces[i];
      originalIndex++;
    }
    return restoredText + "...";
  }
}

async function search11st(item) {
  let search = (document.getElementById("product_item").textContent.match(/-> (.+)/) || [])[1] || item;
  let tag = document.getElementById("st11_product");
  if (issearchdev(search))  return (tag.innerHTML = "<h3>누가 개발자를 검색하래!</h3>");
  if (hasSearched.st11 != 0) return;
  tag.innerHTML = "<h3>검색 중... 결과가 나오고있어요!</h3>";

  const res = await fetch("/11st", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keyword: search
    }),
  });
  const channel = await res.json();

  if (channel.TotalCount._text == 0) {
    return (tag.innerHTML =
      "<h3>검색결과의 상품정보가 존재하지 않습니다.</h3>");
  }

  tag.innerHTML = "";

  for (let k of channel.Product) {
    let ntag = document.createElement("div");
    ntag.setAttribute("class", "col-md-6 col-lg-4 col-xl-3");
    ntag.innerHTML = `
        <div class="rounded position-relative fruite-item">
            <div class="fruite-img">
                <img src="${k.MinorYn._text == "N"? "img/MinorYn.jpeg" : Image_11st + encodeURI(k.ProductImage120._cdata.replace("/x120/", "/780x540/quality/75/").replace("https://cdn.011st.com/", ""))}" class="img-fluid w-100 rounded-top" alt="">
            </div>
						<div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top: 10px; left: 10px;">${k.SellerNick._cdata}</div>
            <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                <h4>${truncateText(k.ProductName._cdata, 17)}</h4>
                <p>배송비 : ${isNaN(k.Delivery._cdata) == false ? `무료` : k.Delivery._cdata}<br>상품평 : ${k.ReviewCount._text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}개<br>구매만족도 :  ${convertScore(k.BuySatisfy._text)}/5.0점</p>
                <div class="d-flex justify-content-between flex-lg-wrap">
                    <p class="text-dark fs-5 fw-bold mb-0">${isNaN(k.SalePrice._text) == false ? `&#x20a9; ${k.SalePrice._text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원` : k.SalePrice._text}</p>
                    <a href="https://www.11st.co.kr/products/pa/${k.ProductCode._text}" class="btn border border-secondary rounded-pill px-3 text-primary" target="_blank" style="font-size:0.8rem;"><i class="fa fa-shopping-bag me-2 text-primary"></i>상품정보 확인</a>
                </div>
            </div>
        </div>
    `;
    tag.appendChild(ntag);
  }
  hasSearched.st11 += 1;
}

async function searchNaver(search, search_data) {
  let tag = document.getElementById("naver_product");
  if (issearchdev(search_data))
    return (tag.innerHTML = "<h3>누가 개발자를 검색하래!</h3>");
  tag.innerHTML = "<h3>검색 중... 결과가 나오고있어요!</h3>";

  const res = await fetch("/naver", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keyword: search_data,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const result = await res.json();
  const channel = result.rss.channel;

  if (channel.total._text == 0) {
    return (tag.innerHTML =
      "<h5>검색결과의 상품정보가 존재하지 않습니다.</h5>");
  }

  tag.innerHTML = "";

  const search_item = channel.title._text.match(/'([^']+)'/);
  let product_item = document.getElementById("product_item");
  product_item.innerText = `- ${search_item[1]}`;

  if (search != search_data) {
    product_item.innerText = `- ${search} -> ${search_item[1]}`;
  }

  for (let k of channel.item) {
    let ntag = document.createElement("div");
    ntag.setAttribute("class", "col-md-6 col-lg-4 col-xl-3");
    ntag.innerHTML = `
            <div class="rounded position-relative fruite-item">
                <div class="fruite-img">
                    <img src="${k.category3._text == "성인용" || k.category3._text == "기타건강관리용품" ? "img/MinorYn.jpeg" : Image_Naver + encodeURI(k.image._text.replace("https://shopping-phinf.pstatic.net/", ""))}" class="img-fluid w-100 rounded-top" alt="">
                </div>
                <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top: 10px; left: 10px;">${k.maker._text ? k.maker._text : k.brand._text}</div>
                <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                    <h4>${truncateText(k.title._text.replace(/<b>|<\/b>/g, ""), 16)}</h4>
                    <p>셀러 : ${k.mallName._text}<br>카테고리 : <cate style="font-size:14px;">${k.category1._text}${k.category2._text ? " > " + k.category2._text : ""}${k.category3._text ? " > " + k.category3._text : ""}${k.category4._text ? " > " + k.category4._text : ""}</cate></p>
                    <div class="d-flex justify-content-between flex-lg-wrap">
                        <p class="text-dark fs-5 fw-bold mb-0">${isNaN(k.lprice._text) == false ? `₩ ${k.lprice._text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`: k.lprice._text}</p>
                        <a href="${k.link._text}" class="btn border border-secondary rounded-pill px-3 text-primary" target="_blank" style="font-size:0.8rem;"><i class="fa fa-shopping-bag me-2 text-primary"></i>상품정보 확인</a>
                    </div>
                </div>
            </div>
        `;
    tag.appendChild(ntag);
  }
}

function addButton_additional(site, search_data) {
  let data = (search_data.match(/-> (.+)/) || [])[1] || search_data.split("\n").map((line) => line.trim().substring(2)).filter(Boolean);
  addButton(site, data);
}

function addButton(site, search_data) {
  let butt = document.getElementById("add_button");
  butt.innerHTML = "";

  butt.style.display = "flex";
  butt.style.alignItems = "center";
  butt.style.justifyContent = "center";

  let buttonElement = document.createElement("button");
  buttonElement.type = "submit";
  buttonElement.className = "btn btn-primary border-3 border-secondary py-2 px-4 position-relative rounded-pill text-white h-100";
  buttonElement.style.top = "5px";
  buttonElement.textContent = "더보기";

  let url =
    site === "naver" ? "https://search.shopping.naver.com/search/all?query="
      : site === "st11" ? "https://search.11st.co.kr/pc/total-search?kwd="
        : // (site === 'coupang') ? 'https://www.coupang.com/np/search?q=' :
          undefined;
  buttonElement.addEventListener("click", function () {
    window.open(`${url}${search_data}`, "_blank");
  });

  butt.appendChild(buttonElement);
}

async function typocheck(search) {
  const ress = await fetch("/typo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keyword: search,
    }),
  });
  const data = await ress.json();
  let search_data = data.errata;
  if (search_data == "" || search_data == undefined || search_data == null) search_data = search;
  searchNaver(search, search_data);
  addButton("naver", search_data);
}

function RunCode() {
  let search = document.getElementById("input_keyword").value;
  displayResult();
  typocheck(search);
  hasSearched.st11 = 0;
}
