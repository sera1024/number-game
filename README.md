# 숫자 마추기.io

1~100 중 숨은 숫자를 찾는 반응형 웹 게임입니다. HTML, CSS, JavaScript만 사용하며 설치할 외부 의존성이 없습니다.

## 실행

저장소 폴더에서 다음 명령을 실행하고 브라우저에서 `http://localhost:8000`을 엽니다.

```sh
python3 -m http.server 8000
```

Python 3이 필요합니다. ES 모듈을 사용하므로 HTML 파일을 직접 더블 클릭하지 말고 HTTP 서버로 실행하세요. Node.js 22 이상이 있다면 `npm start`로도 같은 서버를 시작할 수 있습니다.

## 플레이 방법

- 시작하기를 누르면 정답이 무작위로 결정되고 타이머가 시작됩니다.
- 숫자는 1~10, 11~20 순으로 10행 × 10열에 배치됩니다.
- 오답을 고르면 정답과 같은 행인지, 같은 열인지 각각 알려줍니다. 선택한 오답은 다시 선택할 수 없습니다.
- 정답 타일은 초록색으로 바뀌고 시간이 멈춥니다.
- 점수는 `반올림(10000 / (1 + 소요 시간(초) / 10))`입니다. 빠르게 맞힐수록 높습니다.
- 새 게임 또는 다시 도전하기를 누르면 기록과 보드가 초기화됩니다.
- 마우스, 터치, Tab/Enter 키를 지원합니다.

## 테스트

Node.js 22 이상에서:

```sh
npm test
```

행·열 경계, 시간별 점수, 정답 범위를 검증합니다. 별도의 빌드 단계는 없습니다.

## Git과 GitHub에 저장하기

변경을 먼저 확인한 후 커밋하고 작업 브랜치를 GitHub에 올리세요.

```sh
git switch -c feat/number-game
git status
git diff
git add index.html style.css app.js game.js package.json tests/game.test.js README.md
git commit -m "feat: add number guessing web game"
git push -u origin feat/number-game
```

GitHub 저장소에서 **Compare & pull request**를 눌러 `main` 대상으로 PR을 만들고, 변경을 검토한 뒤 병합합니다. 이미 같은 이름의 브랜치가 있다면 다른 이름을 사용하세요.

웹사이트로 공개하려면 병합 후 GitHub 저장소의 **Settings → Pages → Deploy from a branch → main / (root) → Save**를 선택하세요. 배포가 완료되면 Pages 설정에 표시되는 주소로 게임을 열 수 있습니다. Pages 사용 가능 여부는 저장소 공개 범위와 GitHub 요금제에 따라 다릅니다.

클라우드 환경의 Publish와 Git 커밋·푸시, GitHub Pages 배포는 서로 다른 작업입니다.
