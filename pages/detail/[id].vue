<template>
  <div>
    <div>
      작성자: {{ user?.name }}
    </div>
    <div>
      완료: {{ detail?.completed }}
    </div>
    <div>
      내용: {{ detail?.title }}
    </div>

    <div>
      user: {{ user }}
    </div>
    <div>
      detail: {{ detail }}
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

interface User {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: number
      lng: number
    }
  },
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

const config = useRuntimeConfig()
const route = useRoute()

const { data: detail } = await useAsyncData<Todo>(
  'detail',
  () => $fetch(
    `https://jsonplaceholder.typicode.com/todos/${route.params.id}`,
    {
      baseURL: config.public.apiBase
    }
  )
)
const { data: user } = await useAsyncData<User>(
  'user',
  () => $fetch(
    `https://jsonplaceholder.typicode.com/users/${detail.value?.userId}`,
    {
      baseURL: config.public.apiBase
    }
  ),
  {
    watch: [detail]
  }
)
</script>