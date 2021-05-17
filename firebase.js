import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import Filter from 'bad-words'
import { ref, onUnmounted, computed } from 'vue'

firebase.initializeApp({
    apiKey: "AIzaSyCnAUkxElY10gSxdirCx9Dqpg4SJgDuyJI",
    authDomain: "chat-app-ferenc.firebaseapp.com",
    projectId: "chat-app-ferenc",
    storageBucket: "chat-app-ferenc.appspot.com",
    messagingSenderId: "658690909539",
    appId: "1:658690909539:web:ae84ae4766307a0e1f5f56",
    measurementId: "G-0NFNP2PNTT"
})

const auth = firebase.auth()

export function useAuth() {
    const user = ref(null)
    const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))
    onUnmounted(unsubscribe)
    const isLogin = computed(() => user.value !== null)

    const signIn = async() => {
        const googleProvider = new firebase.auth.GoogleAuthProvider()
        await auth.signInWithPopup(googleProvider)
    } 

    const signOut = () => auth.signOut()

    return { user, isLogin, signIn, signOut }
}

const firestore = firebase.firestore()
const messagesCollection = firestore.collection('messages')
const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100)
const filter = new Filter()

export function useChat() {
    const messages = ref([])
    const unsubscribe = messagesQuery.onSnapshot(snapshot => {
        messages.value = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .reverse()
    })

    onUnmounted(unsubscribe)

    const { user, isLogin } = useAuth()
    const sendMessage = text => {
        if(!isLogin.value) return
        const { photoURL, uid, displayName } = user.value
        messagesCollection.add({
            userName: displayName,
            userId: uid,
            userPhotoURL: photoURL,
            text: filter.clean(text),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    return { messages, sendMessage }
}