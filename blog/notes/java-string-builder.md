---
title: "Java StringBuilder로 문자열 연결하기"
description: "StringBuilder가 필요한 이유와 문자열 추가, 삽입, 삭제, 변경에 사용하는 주요 메서드."
date: "2026-08-14T01:00:00+09:00"
tags: [algorithm, java]
---

Java에서 문자열 몇 개를 간단히 이어 붙일 때는 `+` 연산자로 충분하다.

하지만 문자열을 반복적으로 변경하거나 누적해야 한다면 `StringBuilder`를 사용하는 편이 효율적이다. 예를 들면 다음과 같은 경우다.

- 반복문에서 결과를 계속 이어 붙일 때
- 재귀 호출에서 결과를 계속 이어 붙일 때
- 조건에 따라 문자열 일부를 선택적으로 추가할 때

---

## String을 반복해서 더하면 느린 이유

`String`은 한 번 생성되면 내용을 바꿀 수 없는 불변 객체다. 따라서 기존 문자열에 내용을 더할 때마다 결과를 담을 새로운 `String` 객체가 생성된다.

```java
String result = "";
for (int i = 1; i <= 5; i++) result += i; // 매번 새로운 String 생성
System.out.println(result); // 12345
```

연결 횟수가 많아질수록 이전 문자열을 복사하는 작업도 반복되어 부하가 커진다.

---

## StringBuilder로 문자열 연결하기

`StringBuilder`는 내부 버퍼에 내용을 추가한다.  
마지막에 `toString()`을 호출하면 완성된 문자열을 얻을 수 있다.

```java
StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 5; i++) sb.append(i); // 내부 버퍼에 추가
System.out.println(sb.toString()); // 12345
```

`append()`에는 문자열뿐 아니라 숫자, 문자 등 여러 자료형을 전달할 수 있다.

```java
StringBuilder sb = new StringBuilder();

sb.append("Java");
sb.append(' ');
sb.append(21);

System.out.println(sb); // Java 21
```

---

## 자주 사용하는 메서드

`StringBuilder`는 문자열을 추가하는 것 외에도 삽입, 삭제, 변경 등의 기능을 제공한다.

| 메서드 | 설명 |
| --- | --- |
| `append(value)` | 문자열 끝에 값 추가 |
| `insert(index, value)` | 지정한 위치에 값 삽입 |
| `delete(start, end)` | 지정한 범위의 문자 삭제 |
| `replace(start, end, value)` | 지정한 범위를 다른 문자열로 변경 |
| `reverse()` | 문자열 순서 뒤집기 |
| `length()` | 문자열 길이 반환 |
| `charAt(index)` | 지정한 위치의 문자 반환 |

```java
StringBuilder sb = new StringBuilder("Hello World");

sb.replace(6, 11, "Java");
System.out.println(sb); // Hello Java

sb.reverse();
System.out.println(sb); // avaJ olleH
```
