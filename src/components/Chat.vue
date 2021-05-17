<template>
    <div>
        <div>
            <Message
                v-for="{ id, text, userPhotoURL, userName, userId } in messages"
                :key="id"
                :name="userName"
                :photo-url="userPhotoURL"
                :sender="userId === user?.uid"
            >
            {{text}}
            </Message>
        </div>
    </div>

    <div ref="bottom"></div>
</template>

<script>
import { ref, watch, nextTick } from 'vue'
import { useAuth, useChat } from '../../firebase'

import SendIcon from './SendIcon.vue'
import Message from './Message.vue'

export default {
    components: { Message, SendIcon },
    setup() {
        const { messages } = useChat()
        
        const bottom = ref(null)
        watch(
            messages,
            () => {
                nextTick(() => {
                    bottom.value?.scrollIntoView({ behavior: "smooth" })
                }),
                { deep: true }
            }
        )

        const message = ref('')
        const send = () => {}

        const { user, isLogin } = useAuth()
        return { user, isLogin, messages, message, send }
    }
}
</script>
