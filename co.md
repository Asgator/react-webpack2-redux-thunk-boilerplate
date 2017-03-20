# кодстайл react-компонентов

чтобы меньше букв писать, делаем так:

```
import React, { Component } from 'react';
```

чтобы уменьшиеть количество ререндеров компонента нужно использовать:

```
import React, { PureComponent } from 'react';
```

Так как `react-addons-shallow-compare` устарел

лучше абстрагировать компонент от объекта и передавать в него только нужные именно этому компоненту поля. в camelCase:

```
props: {
  isFoo: boolean,
  someField: string
}
```

# для определения типов props юзаем Flow:

```
type Props = {
  id: number
};

class MyComponent extends Component {
  props:Props;
}
```

Многие типы api сущностей описаны на flow и лежат в http://git.rn/projects/ZP/repos/flow-types/browse

Пример:
```
import { Resume } from '@zp/flow-types/resume';
```

# прочие настройки .eslintrc
помимо всего прочего, в пятницу мы включили в конфиг вебпака `.eslintrc`, в котором проверяются некоторые вещи, в т.ч.:
- большое количество правил от airbnb
- имена обработчиков событий (`on*` для внешних props, `handle*` для внутренних)

(на всё это будет ругаться webpack при сборке и в консоли браузера при разработке)

# структура папочек

```actions/```
Redux экшены

```reducers/```
Redux редюсеры

```store/```
Конфигурация redux стора

```types/```
Внутренние реиспользуемые типы (Flow) сущностей

```utils/```
Реиспользуемые функции

```enhancers/```
Обёртки над компонентами

```constants/```
Константы проекта, также там хранятся константые для экшенов

```elements/```
абсолютно независимые компоненты типа кнопочек-с-иконками, совсем-кастомных-дропдаунов и прочего. подразумевается, что их будет довольно мало

```modules/```
реюзаемые комбинации простых компонентов, например: блок контактной информации, модальное окно, реюзаемая каруселька etc.

```views/```
комбинация нескольких модулей, связанных одной большой сущностью, например карточка вакансии или компании

```containers/```
прослойки между роутером и views, которые работают с данными: передают во views данные из сторов и вызывают redux-экшены при срабатывании во views событий

```pages/```
страницы, могут иметь свои приватные контейнеры и компоненты, как только контейнер или компонент реиспользуется, его стоит вынести в соответствующую папку. (containers/components)

```
actions:
  // Хранятся общие экшены для всех страниц
  vacancies.js
  // Если файл большой можно переместить типы flow в types.js
  resumes:
    index.js
    types.js // Типы flow (смотри action types)
  vacancies-state.js
  pages: // Хранятся экшены для конкретной страницы, не могут быть использованы, вне компонента конкретного page
    resumes-stat:
      stat.js
      companies.js
```

action types (от 21.11.2016):
используем экшны следующим образом:

```
type NumberAction = {
    type: 'FETCH', // используем именно строковый литерал, потому что этого требует flow disjoint union
    payload: number
}

type StringAction = {
    type: 'PUSH',
    payload: string
}

type ObjectAction = {
    type: 'PULL',
    payload: {
        ids: Array<number>
    }
}

type Action = NumberAction | StringAction | ObjectAction;

function reducer(state:any, action:Action) { ... }
```

после этого, в операторах if и switch в зависимости от кейса, в выбранный блок подтянется необходимый тип
помним, что:
    1) сколько разных структур придет в редюсер - столько и типов должно быть указано
    2) в типах строковой литерал обязателен, в редьюсере можно обращаться через types.SOME_TYPE (sic!)
    3) некоторые абстрактные типы экшнов уже есть (PlainAction, ErrorAction, etc) в actions/types

```

reducers:
  // Общие состояния
  index.js
  vacancies:
    index.js
    entities.js // Хранятся все полученые вакансии под id
    loading.js // Загрузка конкретной вакансии по id
    errors.js // Ошибки конкретной вакансии по id
  pages: // Состояние для конкретной страницы, это не общие данные и могут быть использованы только на той страницы, для которой они были созданы
    company-card.js
    vacancy-card.js
    resumes-list:
      list.js
      popup.js

constants:
  user.js
  actions: // Константы для Redux экшенов
    vacancies.js
    user.js

components: // Хранятся общие компоненты
  elements:
    my-element-1:
      index.js
      styles.less
      img:
        my-img-1.png
  modules:
    my-module-1:
      index.js
      styles.less
      img:
        my-img-1.png
  views:
    my-view-1:
      index.js
      styles.less
      img:
        my-img-1.png
      my-private-component:
        index.js
        styles.less
        img:
          my-img-1.png

containers: // Хранятся общие containers
  my-container-1
    index.js
    // Не стоит использовать, если с данными не происходит манипуляции
    // пример не манипуляции: { resume: state.resume, vacancy: state.vacancy[id] }
    ?selectors.js
    ?validate.js // Для валидации Redux-form

pages:
  my-page-1
    index.js
    styles.less
    img:
      my-img-1.png
    containers: // Хранятся containers для конкретной страницы
      my-private-container-1
        index.js
        styles.less
        img:
          my-img-1.png
    }
    elements: // Хранятся elements для конкретной страницы
      my-private-element-1
        index.js
        styles.less
        img:
          my-img-1.png
    views: // Хранятся views для конкретной страницы
      my-private-view-1:
        index.js
        styles.less
        img:
          my-img-1.png
        my-private-component:
          index.js
          styles.less
          img:
          my-img-1.png

index.js // Точка входа проекта
routes.js // Прописание путей страниц
test.js // Точка входа для тестов
```

насчёт внутренних компонентов, так:

```
modules:
  my-custom-module:
    index.js
    private-sub-module:
      index.js
```

или так:

```
modules:
  my-custom-module:
    index.js
    private-sub-module.js
```
