# Bun 도입해보기

최근 Bun이 Node.js보다 성능이 최대 3배까지 좋다는 글을 읽어 최근에 만들어본 Youtube-Shortener 백엔드에 적용해보기로 하였다.

## 적용 과정

bun을 설치한 뒤 기존 프로젝트 파일에서

```
bun install
```
을 통해 bun 런타임에 맞는 라이브러리를 설치해 주었다. 이후 package.json에서 run과 test를 아래와 같이 바꿔주었다.

```
// ...
run : "bun run ./bin/www"
test : "bun run --watch ./bin/www"
```

먼저 로컬 환경에서 실행해 보니 Bun이 Nodejs 환경보다 훨씬 빠르다고 느껴져 실제로 벤치마크 후 도입해보기로 하였다.

## 벤치마크 결과
각각 node:alpine 이미지와 oven/bun:1 이미지를 사용하여 docker로 container를 생성하여 벤치마크하였다.
데이터베이스는 기존 프로젝트에서 사용하는 컨테이너를 그대로 사용하였다.

사용한 벤치마크 커멘드는 아래와 같다.
```
wrk -t12 -c400 -d30s http://127.0.0.1:3000/
```
### 1. Bun
```
Running 30s test @ http://127.0.0.1:3000/
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    48.74ms   18.62ms 377.34ms   98.01%
    Req/Sec   702.45    105.68     1.01k    82.01%
  250092 requests in 30.08s, 320.55MB read
Requests/sec:   8314.79
Transfer/sec:     10.66MB
```

### 2. Node.js
```
Running 30s test @ http://127.0.0.1:3000/
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    92.28ms  118.47ms   2.00s    97.98%
    Req/Sec   419.90     87.11     1.85k    91.39%
  145833 requests in 30.07s, 193.46MB read
  Socket errors: connect 0, read 0, write 0, timeout 128
Requests/sec:   4850.51
Transfer/sec:      6.43MB
```

### 결과 해석

응답 지연 시간 (Latency):

Bun: 평균 약 48.74ms, 최대 377.34ms

Node.js: 평균 약 92.28ms, 최대 2.00초

$\rightarrow$ Bun은 Node.js보다 거의 절반 수준의 평균 지연 시간을 보이며, 최대 지연 시간에서도 크게 우수했다.


처리량 (Requests/sec & Transfer/sec):

Bun: 초당 약 8,315 요청, 전송량 10.66MB

Node.js: 초당 약 4,851 요청, 전송량 6.43MB

$\rightarrow$ Bun이 Node.js보다 약 70% 이상의 요청 처리량을 기록하며, 네트워크 데이터 전송량에서도 더 좋은 성능을 보여주었다.

안정성:

Node.js의 경우 30초 동안 128회의 타임아웃 에러가 발생한 반면, Bun에서는 에러 없이 테스트가 진행되었다.


결과적으로 Bun 런타임을 이용한 서버가 좋은 성능을 보여주어 Bun 런타임으로 서버를 교체하였다.
