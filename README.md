# yuyeol3.github.io

Next.js App Router와 GitHub Pages로 운영하는 개인 블로그입니다.

## 로컬 실행

```sh
npm install
npm run dev
```

## 검증 및 빌드

```sh
npm run lint
npm run typecheck
npm run build
```

`npm run build`는 정적 사이트를 `out/`에 생성하고, 게시글과 카테고리 산출물이 모두 존재하는지 검사합니다.

그룹에 속한 게시글은 `posts/<group>/<category>/<YYYY-MM-DD-title>.md`에 추가합니다. 그룹이 없는 카테고리는 `posts/<category>/<YYYY-MM-DD-title>.md` 형식을 사용합니다. `main` 브랜치에 push하면 GitHub Actions가 정적 사이트를 빌드해 GitHub Pages로 배포합니다.
