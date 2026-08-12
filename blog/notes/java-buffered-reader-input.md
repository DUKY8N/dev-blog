---
title: "Java BufferedReader로 빠르게 입력받기"
description: "BufferedReader와 StringTokenizer를 사용해 알고리즘 문제의 입력을 효율적으로 읽고 자료형으로 변환하는 방법."
date: "2026-08-12T21:00:00+09:00"
tags: [algorithm, java]
---

입력량이 많은 알고리즘 문제에서는 `Scanner` 대신 `BufferedReader`를 사용해 입력 시간을 줄일 수 있다. 다만 입력값을 직접 나누고 필요한 자료형으로 변환하는 등 데이터 가공에 더 신경 써야 한다.

---

## 전체 입력 처리 흐름

입력 처리에는 다음 클래스가 사용된다.

1. `System.in`
1. `InputStreamReader`
1. `BufferedReader`
1. `StringTokenizer`

```text
System.in으로 표준 입력을 바이트 단위로 받기
  ↓
InputStreamReader로 바이트를 문자로 변환
  ↓
BufferedReader의 readLine()으로 한 줄을 문자열로 읽기
  ↓
한 줄에 여러 값이 있다면 StringTokenizer의 nextToken()으로 하나씩 읽기
  ↓
필요한 자료형으로 변환
```


각각 어떤 역할을 하는지 자세히 살펴보자.

---

## 1. System.in: 입력의 시작점

```java
System.in
```

`System.in`은 키보드로 들어오는 입력 스트림이다. 입력을 바로 문자열처럼 다루기에는 불편하므로 문자 단위로 읽을 수 있게 감싸는 과정이 필요하다.

## 2. InputStreamReader: 바이트를 문자로 변환

```java
new InputStreamReader(System.in)
```

`InputStreamReader`는 `System.in`으로 들어온 바이트 입력을 문자 입력으로 변환한다.

## 3. BufferedReader: 입력을 한 줄씩 읽기

```java
BufferedReader br =
    new BufferedReader(new InputStreamReader(System.in));
```

`BufferedReader`는 `InputStreamReader`에서 전달받은 문자를 내부 버퍼에 모아 효율적으로 읽는 클래스다. `readLine()`을 호출하면 줄바꿈 문자를 기준으로 한 줄 분량의 문자를 읽어 하나의 문자열로 반환한다. 이때 줄바꿈 문자는 반환되는 문자열에 포함되지 않는다.

```java
String line = br.readLine();
```

## 4. StringTokenizer: 한 줄에 있는 여러 값 나누기

한 줄에 값이 하나라면 `readLine()`의 반환값을 그대로 사용하면 된다. 하지만 한 줄에 여러 값이 공백으로 구분되어 있을 때는 `StringTokenizer`로 값을 나눈다. 다음 입력을 예로 들어 보자.

```text
10 20 30
```

`br.readLine()`은 이 입력을 `"10 20 30"`이라는 하나의 문자열로 반환한다. 이 문자열로 `StringTokenizer`를 생성한다.

```java
StringTokenizer st = new StringTokenizer(br.readLine());
```

이후 `nextToken()`을 호출할 때마다 공백으로 구분된 다음 값을 문자열로 꺼낼 수 있다.

```java
String token = st.nextToken();
```

## 5. 자료형 변환하기

`Scanner`의 `nextInt()`는 값을 바로 정수로 반환한다. 반면 `StringTokenizer`의 `nextToken()`은 문자열을 반환하므로 필요한 자료형으로 직접 변환해야 한다.

```java
int a = Integer.parseInt(st.nextToken());
long b = Long.parseLong(st.nextToken());
double c = Double.parseDouble(st.nextToken());
char ch = st.nextToken().charAt(0);
```

---

## 전체 코드

알고리즘 문제에서 자주 사용하는 형태는 다음과 같다.

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());

        int a = Integer.parseInt(st.nextToken());
        long b = Long.parseLong(st.nextToken());
        double c = Double.parseDouble(st.nextToken());
        char ch = st.nextToken().charAt(0);
    }
}
```
