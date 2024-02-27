# 코드 작동법
## 1. 사용자가 검색창에 키워드를 입력 후 검색버튼 또는 엔터키 입력 시 RunCode 함수 실행됨
### 1-1. 데이터 결과를 표시해주는 함수 실행 (displayResult)
### 1-2. 받아온 검색창 데이터를 typocheck 함수로 전송
### 1-3. n차 검색 시 발생할 오류를 방지하기 위해 hasSearched 객체 내의 {쇼핑몰이름} 인자 0으로 초기화

## 2. typocheck 함수 실행
### 2-1. 오타가 있는지를 체킹 후 search_data 변수에 저장 (내부API인 /typo는 오타가 없으면 null을 반환하는 시스템 고려)
### 2-2. searchNaver 함수에 체킹 전 검색어와 체킹 후 검색어를 모두 전송
### 2-3. addButton 함수 실행 ('더보기' 버튼 추가)

## 3. searchNaver 함수 실행
### 3-1. search와 search_data 인자 송신 (오타 수정에 용이하기 때문)
### 3-2. issearchdev 함수에 검색어 전송 (개발자 이름 검색 여부)
### 3-3. tag 변수 지정 (네이버 검색결과 표시를 위한 div)
### 3-4. tag 변수에 innerHTML로 검색 중임을 표기
### 3-5. 백엔드 API와 통신하여 결과값을 channel로 받아오기
#### 3-5-1. 상품 정보 미존재 시 tag변수에 innerHTML로 표기
### 3-6. 2-2에서 전송받은 검색어를 html에 표시 (product_item 변수에 innerText)
#### * 체킹 전 검색어와 체킹 후 검색어가 같지 않다 = 오타가 있다
### 3-7. 데이터 정렬
#### 3-7-1. truncateText 함수를 이용하여 띄어쓰기 제외 16글자부터 cut

## 4. search11st 함수 실행
### 4-1. 검색어 변수 search 지정 (오타가 있을 경우 product_item 텍스트로 지정, 없을 경우 인자로 받은 item 지정)
### 4-2. issearchdev 함수에 검색어 전송 (개발자 이름 검색 여부)
### 4-3. tag 변수 지정 (네이버 검색결과 표시를 위한 div)
### 4-4. hasSearched 객체의 st11 인자가 1이 아닐 경우 검색을 하지 않음 (검색 버튼을 누르지 않았을 때 추가 검색 방지)
### 4-5. tag 변수에 innerHTML로 검색 중임을 표기
### 4-6. 백엔드 API와 통신하여 결과값을 channel로 받아오기
#### 4-6-1. 상품 정보 미존재 시 tag변수에 innerHTML로 표기
### 4-7. 데이터 정렬
#### 4-7-1. truncateText 함수를 이용하여 띄어쓰기 제외 16글자부터 cut
#### 4-7-2. convertScore 함수를 이용하여 100점 만점의 구매만족도를 5점 만점으로 변환
### 4-8. hasSearched 객체의 st11 인자에 1을 추가하여 추가 검색 방지 (4-4 참고)

# 새로운 사이트를 추가할 때
## - 백엔드
### index.js -
#### 1. 쇼핑몰사이트 API와 연동
#### 2. 이미지 리사이징 호스팅
#### 3. CORS 보안정책 추가

## - 프론트엔드
### - index.html 
#### 1. container-fluid fruite py-5 클래스 참고하여 div수정
##### : <div id="tab-{number}" class="tab-pane fade show p-0 active">
<div class="row g-4">
<div class="col-lg-12">
<div class="row g-4" id="{쇼핑몰이름}_product"></div>
</div>
</div>
</div>

### - main.js
#### 1. displayResult 함수에 쇼핑몰사이트 이름 추가
#### 2. hasSearched 객체의 {쇼핑몰이름} 인자 추가 후 0으로 초기화
#### 3. 비동기형 함수 search{쇼핑몰이름} 생성 (ex: async searchCoupang)
#### 4. search11st 함수를 참고하여 2번 변수 사용방법과 기본적 데이터정렬 시스템 파악 후 함수 제작
##### * hasSearched 객체 중요
##### * issearchdev 함수 사용
##### * '검색 중' 표시 innerHTML 필수
##### * 상품정보 미존재 innerHTML 필수
##### * '검색 중' 표시 innerHTML 삭제 코드 (tag.innerHTML = "") 필수
##### * hasSearched 객체의 {쇼핑몰이름} 인자에 1 추가 필수 (hasSearched.{쇼핑몰이름} += 1)
##### * typocheck 함수는 건들이지 말 것
#### 5. addButton 함수의 url 변수 수정 (쇼핑몰사이트 통합검색 링크 추가)
#### 6. displayResult 함수에 onclick 인자 추가
##### * onclick="search{쇼핑몰이름}(document.getElementById('input_keyword').value); addButton_additional('{쇼핑몰이름}', document.getElementById('product_item').textContent);
#### 7. RunCode 함수에 2번 변수 

