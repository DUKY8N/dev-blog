---
title: "Mermaid 다이어그램 예제"
description: "Pele로 렌더링한 흐름도, 시퀀스, 클래스, ER 다이어그램 예제."
date: "2026-10-28T14:31:00+09:00"
tags: [mermaid, pele]
---

Markdown의 `mermaid` 코드블록을 Pele가 SVG로 변환한 예제다. 다이어그램은 빌드할 때 생성되므로 브라우저에서 JavaScript를 실행하지 않아도 표시된다.

## 흐름도

조건에 따라 작업이 나뉘거나 이전 단계로 돌아가는 흐름을 표현한다.

```mermaid title="블로그 글 발행 과정"
flowchart TB
  accTitle: 블로그 글 발행 과정
  accDescr: Markdown을 작성하고 빌드한다. 성공하면 배포하고, 실패하면 오류를 수정한 뒤 다시 작성 단계로 돌아간다.
  A["Markdown 작성"] --> B["Astro 빌드"]
  B --> C{"빌드 성공?"}
  C -->|성공| D["정적 페이지 배포"]
  C -->|실패| E["오류 수정"]
  E --> A
```

## 시퀀스 다이어그램

사용자, 서버, 데이터베이스가 어떤 순서로 메시지를 주고받는지 표현한다.

```mermaid title="게시글 조회 요청"
sequenceDiagram
  accTitle: 게시글 조회 요청
  accDescr: 사용자가 서버에 게시글을 요청하면 서버가 데이터베이스를 조회한다. 조회 결과에 따라 게시글 또는 오류 응답을 반환한다.
  participant U as 사용자
  participant S as 서버
  participant D as 데이터베이스
  U->>S: GET /posts/1
  S->>D: 게시글 조회
  D-->>S: 조회 결과
  alt 게시글이 있는 경우
    S-->>U: 200 OK + 게시글
  else 게시글이 없는 경우
    S-->>U: 404 Not Found
  end
```

## 클래스 다이어그램

서비스가 구체적인 구현체 대신 인터페이스에 의존하는 구조를 표현한다.

```mermaid title="서비스와 저장소의 의존 관계"
classDiagram
  accTitle: 서비스와 저장소의 의존 관계
  accDescr: MemberService는 MemberRepository 인터페이스에 의존하고, MemoryMemberRepository가 이 인터페이스를 구현한다.
  class MemberService {
    -MemberRepository repository
    +findMember(id) Member
  }
  class MemberRepository {
    <<interface>>
    +findById(id) Member
  }
  class MemoryMemberRepository {
    +findById(id) Member
  }
  MemberService --> MemberRepository : 의존
  MemberRepository <|.. MemoryMemberRepository : 구현
```

## ER 다이어그램

한 명의 사용자가 여러 게시글을 작성할 수 있는 데이터 관계를 표현한다. `PK`는 기본 키, `FK`는 외래 키다.

```mermaid title="사용자와 게시글의 일대다 관계"
erDiagram
  accTitle: 사용자와 게시글의 일대다 관계
  accDescr: 사용자는 게시글을 0개 이상 작성할 수 있고, 각 게시글은 정확히 한 명의 작성자에게 속한다.
  USER ||--o{ POST : writes
  USER {
    int id PK
    string name
  }
  POST {
    int id PK
    int author_id FK
    string title
  }
```
