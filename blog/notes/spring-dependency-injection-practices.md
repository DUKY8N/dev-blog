---
title: "Spring 의존관계 주입 제대로 쓰기"
description: "생성자 주입을 권장하는 이유부터 선택적 주입, @Qualifier와 @Primary, 여러 빈 주입과 자동 등록 및 수동 등록의 선택 기준까지."
date: "2026-10-28T22:00:00+09:00"
tags: [backend, spring]
---

`@Autowired`는 스프링 컨테이너가 필요한 빈을 찾아 넣어 주는 기능이다. 붙이기만 해도 동작하지만, 제대로 쓰려면 몇 가지를 더 정해야 한다.

빈을 어떤 통로로 넣을지, 넣을 빈이 없거나 여러 개일 때는 어떻게 할지, 그리고 어떤 빈을 자동으로 등록하고 어떤 빈을 수동으로 등록할지. 이 글은 이 질문들에 차례로 답한다.

---

## 주입 방법 네 가지

| 방법 | 방식 | 특징 |
| --- | --- | --- |
| 생성자 주입 | 생성자로 받는다 | 생성 시점에 딱 한 번 호출된다. **불변, 필수** 의존관계에 쓴다 |
| 수정자 주입 | setter로 받는다 | **선택, 변경** 가능성이 있는 의존관계에 쓴다 |
| 필드 주입 | 필드에 바로 넣는다 | 간결하지만 외부에서 바꿀 수 없어 테스트가 어렵다. 쓰지 않는다 |
| 일반 메서드 주입 | 아무 메서드로 받는다 | 여러 개를 한 번에 받을 수 있지만 거의 쓰지 않는다 |

```java
// 생성자 주입
@Component
public class Client {
    private final Repo repo;

    // 생성자가 하나면 @Autowired 생략 가능
    public Client(Repo repo) { this.repo = repo; }
}

// 수정자 주입
@Autowired
public void setRepo(Repo repo) { this.repo = repo; }

// 필드 주입 (쓰지 않는다)
@Autowired
private Repo repo;
```

> **참고**: 자동 주입은 스프링 빈에서만 동작한다. 빈이 아닌 클래스에 `@Autowired`를 붙여도 아무 일도 일어나지 않는다.

## 생성자 주입을 권장하는 이유

예전에는 수정자 주입과 필드 주입을 많이 썼지만, 지금은 스프링을 비롯한 DI 프레임워크 대부분이 생성자 주입을 권장한다. 이유는 크게 세 가지다.

- **불변**: 의존관계는 한 번 정해지면 애플리케이션이 끝날 때까지 바뀔 일이 거의 없다. 수정자 주입은 setter를 통해 의존관계를 바꿀 수 있다. 특히 이를 `public`으로 열어 두면 외부에서 실수로 변경할 가능성이 생긴다. 생성자는 객체를 만들 때 한 번만 호출되므로 불변하게 설계할 수 있다.
- **누락 방지**: 스프링 없이 순수 자바로 테스트할 때, 수정자 주입은 의존관계를 빠뜨려도 실행 중 `NullPointerException`이 날 수 있다. 생성자 주입은 필수 파라미터를 빠뜨리면 **컴파일 오류**가 나서 바로 알 수 있다. 다만 명시적으로 `null`을 전달하는 것까지 막아 주지는 않는다.
- **final 사용**: 생성자 주입만 필드에 `final`을 붙일 수 있다. 생성자에서 값을 넣지 않으면 컴파일러가 잡아 준다. 나머지 방식은 생성자 이후에 호출되므로 `final`을 쓸 수 없다.

```java
private final Repo repo;

public Client(Repo repo) {
    // this.repo = repo;  ← 빠뜨리면
}
// 컴파일 오류: variable repo might not have been initialized
```

> **정리**: 기본은 생성자 주입, 꼭 필요한 선택 의존관계만 수정자 주입을 함께 쓴다. 필드 주입은 쓰지 않는다. 컴파일 오류는 가장 빠르고 좋은 오류다.

## 롬복으로 생성자 코드 줄이기

생성자 주입을 쓰면 필드마다 생성자 파라미터와 대입 코드를 반복해서 써야 한다. 롬복의 `@RequiredArgsConstructor`는 초기화되지 않은 `final` 필드와 `@NonNull` 필드를 대상으로 생성자를 만들어 준다. 생성자가 하나뿐이니 `@Autowired`도 생략된다.

```java
@Component
@RequiredArgsConstructor
public class Client {
    // 생성자는 롬복이 컴파일 시점에 만들어 준다
    private final Repo repo;
    private final Policy policy;
}
```

최근에는 생성자를 하나만 두고 `@Autowired`를 생략하는 방식에, `@RequiredArgsConstructor`를 함께 쓰는 것이 일반적이다.

## 주입할 빈이 없을 때

`@Autowired`에는 `required` 속성이 있고, **기본값은 `true`다**. 그래서 `@Autowired`만 붙이면 `required = true`로 동작해, 주입할 빈이 없을 때 오류가 난다. 빈이 없어도 동작하게 하려면 세 가지 방법이 있다.

```java
@Autowired(required = false)   // 빈이 없으면 메서드 자체가 호출되지 않는다
public void setRepo(Repo repo) { }

@Autowired                     // 빈이 없으면 null이 들어온다
public void setRepo(@Nullable Repo repo) { }

@Autowired                     // 빈이 없으면 Optional.empty()가 들어온다
public void setRepo(Optional<Repo> repo) { }
```

`@Nullable`과 `Optional`은 생성자 주입에서도 특정 파라미터에만 쓸 수 있다.

## 같은 타입의 빈이 여러 개일 때

생성자 주입을 쓰더라도, 넣을 빈이 하나로 정해지지 않으면 문제가 생긴다. `@Autowired`는 타입으로 빈을 찾기 때문에, 주입 가능한 빈이 여러 개이고 우선순위나 구분자로 하나를 결정할 수 없으면 `NoUniqueBeanDefinitionException`이 난다.

```java
@Component public class FixPolicy implements Policy { }
@Component public class RatePolicy implements Policy { }

@Autowired
private Policy policy;  // 어느 것을 넣을지 몰라 오류
```

하위 타입(`RatePolicy`)으로 지정하면 해결은 되지만, 클라이언트가 구체적인 구현에 의존하게 된다. 대신 아래 세 가지 방법을 쓴다.

### 1. 필드명 매칭

타입에 맞는 후보가 여러 개이고 `@Primary` 등으로 하나가 정해지지 않으면, 필드명이나 파라미터명이 빈 이름과 일치하는지도 확인한다. 생성자 파라미터명으로 매칭하려면 컴파일 시 `-parameters` 옵션으로 이름을 보존해야 한다.

```java
@Autowired
private Policy ratePolicy;  // 빈 이름 ratePolicy가 주입된다
```

### 2. @Qualifier

빈 등록 시점과 주입 시점에 같은 구분자를 붙인다. 빈 이름을 바꾸는 것이 아니라 추가 구분자를 다는 것이다.

```java
@Component
@Qualifier("mainPolicy")
public class RatePolicy implements Policy { }

public Client(@Qualifier("mainPolicy") Policy policy) { ... }
```

`@Qualifier`는 타입으로 찾은 후보를 구분자에 맞게 좁힌다. 빈 이름도 구분자 값으로 매칭될 수 있지만, 타입과 무관하게 이름만으로 조회하는 것은 아니다. 후보를 하나로 결정할 수 없으면 예외가 난다.

### 3. @Primary

여러 빈이 매칭되면 `@Primary`가 붙은 빈이 우선권을 가진다. 주입받는 쪽 코드는 손대지 않아도 된다.

```java
@Component
@Primary
public class RatePolicy implements Policy { }
```

### @Primary와 @Qualifier, 언제 무엇을

`@Qualifier`는 주입받는 모든 곳에 붙여야 한다는 번거로움이 있다. 그래서 자주 쓰는 기본 빈에는 `@Primary`를, 가끔 쓰는 특별한 빈에는 `@Qualifier`를 붙여 명시적으로 꺼내 쓰는 조합이 깔끔하다. 예를 들어 메인 DB 커넥션 빈은 `@Primary`, 서브 DB 커넥션 빈은 `@Qualifier`로 구분한다.

`@Qualifier`가 있으면 먼저 그 조건에 맞는 후보로 범위를 좁힌다. 따라서 기본 `@Primary` 빈이 아니라 특별한 구분자가 붙은 빈을 선택할 수 있다. 좁혀진 후보 안에서도 여러 빈이 남으면 `@Primary` 등의 선택 규칙이 적용된다.

### 애노테이션을 직접 만들어 오타 막기

`@Qualifier("mainPolicy")`처럼 문자열을 쓰면 오타가 나도 컴파일 시점에 잡히지 않는다. `@Qualifier`를 품은 애노테이션을 직접 만들면 이 문제를 해결할 수 있다.

```java
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER,
         ElementType.TYPE, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Qualifier("mainPolicy")
public @interface MainPolicy { }

@Component
@MainPolicy
public class RatePolicy implements Policy { }

public Client(@MainPolicy Policy policy) { ... }
```

> **참고**: 이것은 클래스 상속이 아니라 메타 애노테이션을 활용한 구성이다. 스프링이 직접 만든 애노테이션에 붙은 `@Qualifier`도 인식한다. 다만 목적 없이 애노테이션을 늘리면 유지보수가 오히려 어려워질 수 있다.

## 같은 타입의 빈이 모두 필요할 때

지금까지는 여러 빈 중 하나를 고르는 방법이었다. 반대로 해당 타입의 빈이 전부 필요할 때도 있다. 예를 들어 클라이언트가 할인 정책(fix, rate)을 골라 쓸 수 있게 하려면, 모든 정책 빈을 받아 두고 필요할 때 꺼내면 된다. 전략 패턴을 아주 간단하게 구현할 수 있다.

```java
@Component
public class DiscountService {
    private final Map<String, Policy> policyMap;  // 빈 이름 → 빈

    public DiscountService(Map<String, Policy> policyMap) {
        this.policyMap = policyMap;
    }

    public int discount(int price, String code) {
        Policy policy = policyMap.get(code);  // "fixPolicy" 또는 "ratePolicy"
        if (policy == null) {
            throw new IllegalArgumentException("Unknown policy: " + code);
        }
        return policy.discount(price);
    }
}
```

스프링은 파라미터의 제네릭 타입(Policy)을 보고, 해당 타입의 빈을 모두 모아 넣어 준다. 일반 생성자 주입이 타입으로 빈 하나를 찾는 것과 같은 원리이고, 컨렉션이면 하나 대신 전부를 담아준다.

- `Map<String, Policy>`: 키에 빈 이름, 값에 해당 타입의 빈을 모두 담아 준다.
- `List<Policy>`: 해당 타입의 빈을 모두 담아 준다.
- 위 예시처럼 단일 생성자의 컬렉션이나 Map 파라미터는 일치하는 빈이 없으면 빈 값으로 주입될 수 있다. 필드나 메서드의 필수 `@Autowired` 주입까지 항상 같은 규칙이 적용되는 것은 아니다.

## 자동 등록과 수동 등록, 실무 기준

주입을 잘 쓰는 것만큼, 빈을 어떻게 등록할지도 정해 두어야 한다. 어떤 빈이 어디에 들어가는지는 결국 등록 방식에서 드러나기 때문이다.

스프링은 시간이 갈수록 자동을 선호하는 추세다. 빈을 `@Component` 하나로 등록할 수 있는데, 설정 클래스에 `@Bean`과 생성 코드, 주입 대상을 일일이 적는 일은 번거롭다. 빈이 많아지면 설정 정보 관리 자체가 부담이 된다. 무엇보다 자동 등록으로도 OCP와 DIP를 지킬 수 있다. 그래서 **기본은 자동 등록**이다.

업무 로직과 기술 지원 객체를 구분하면 등록 방식을 선택하기 쉽다.

| 구분 | 예 | 권장 |
| --- | --- | --- |
| 업무 로직 빈 | 컨트롤러, 서비스, 리포지토리 | 수가 많고 패턴이 비슷하며 문제 위치가 잘 드러나므로 **자동** |
| 기술 지원 빈 | DB 연결, 공통 로그, AOP | 수가 적지만 애플리케이션 전반에 영향을 주고 문제가 잘 안 드러나므로 **수동** |

- **기술 지원 객체**는 수동 빈으로 등록해 설정 정보에 바로 드러나게 하는 것이 유지보수에 좋다.
- **다형성을 적극 활용하는 비즈니스 로직**(앞의 `Map<String, Policy>`처럼)은 어떤 빈이 주입될지 코드만 보고 알기 어렵다. 수동 빈으로 한곳에 모아 등록하거나, 자동으로 하더라도 **같은 패키지에 묶어 두자**. 핵심은 딱 보고 이해가 되어야 한다는 것이다.

예를 들어 할인 정책 빈들을 별도의 설정 클래스로 묶어 수동 등록하면, 이 클래스만 봐도 어떤 빈이 어떤 이름으로 주입될지 한눈에 보인다. 이 방식으로 전환할 때는 앞 예시의 정책 클래스에서 `@Component`를 제거해 중복 등록을 피한다.

```java
@Configuration
public class PolicyConfig {
    @Bean
    public Policy ratePolicy() { return new RatePolicy(); }

    @Bean
    public Policy fixPolicy() { return new FixPolicy(); }
}
```

> **참고**: 스프링과 스프링 부트가 자동으로 등록하는 기술 지원 빈은 매뉴얼대로 잘 쓰면 된다. 직접 수동 등록하라는 이야기는 내가 만든 기술 지원 객체에 해당한다.

---

기본은 생성자 주입이다. 의존관계를 생성 시점에 한 번만 정하니 중간에 바뀔 일이 없고, 빠뜨리면 컴파일러가 바로 알려 준다. `final`과 롬복을 함께 쓰면 코드도 짧게 유지된다.

넣을 빈이 여러 개라면 `@Qualifier`나 `@Primary`로 고르고, 모두 필요하다면 `List`나 `Map`으로 받는다. 등록은 업무 로직은 자동으로, 기술 지원 객체는 수동으로 하는 것이 기본이다. 결국 제대로 쓴다는 것은, 어떤 빈이 어디에 들어가는지 누가 봐도 알 수 있게 만드는 일이다.

