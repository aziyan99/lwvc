import Peer from 'simple-peer'
import MediaHander from '../MediaHandler'

export const setAuthUser = ({commit}, user) => {
    commit('SET_AUTH_USER', user)
}

export const setOnlineUsers = ({commit}, users) => {
    commit('SET_ONLINE_USERS', users)
}

export const insertOnlineUser = ({commit}, user) => {
    commit('INSERT_ONLINE_USER', user)
}

export const removeOnlineUser = ({commit}, user) => {
    commit('REMOVE_ONLINE_USER', user)
}

export const startCall = ({commit, state}, user) => {
    const mediaHandler = new MediaHander;
    
    mediaHandler.getPermissions().then((stream) => {
        const peer1 = new Peer({
            initiator: true, 
            trickle: false,
            stream: stream,
            config: { 
                iceServers: [
                    // {
                    //     urls: "stun:numb.viagenie.ca",
                    //     username: "sultan1640@gmail.com",
                    //     credential: "98376683"
                    // },
                    // {
                    //     urls: "turn:numb.viagenie.ca",
                    //     username: "sultan1640@gmail.com",
                    //     credential: "98376683"
                    // }
                    {
                        urls: "stun:ss-turn1.xirsys.com",
                        username: "5WLEHGzKOtYyOC-vbmBh0LuGSJf-HMjRi9XL2z9lEExlvh6taFCamkOX1GAN0xv0AAAAAGHllKdsd3ZjVHVybg==",
                        credential: "cf0f03b8-77af-11ec-a5ca-0242ac140004"
                    },
                    {
                        urls: "turn:ss-turn1.xirsys.com:80?transport=udp",
                        username: "5WLEHGzKOtYyOC-vbmBh0LuGSJf-HMjRi9XL2z9lEExlvh6taFCamkOX1GAN0xv0AAAAAGHllKdsd3ZjVHVybg==",
                        credential: "cf0f03b8-77af-11ec-a5ca-0242ac140004"
                    }
                ]
            },
        })
        
        peer1.on("signal", data => {
            const channel = Echo.private(`video-call.${user.id}`)
            setTimeout(() => {
                channel.whisper('incomingVideoCall', {
                    fromUser: state.authUser,
                    signalData: data
                });
            }, 3000);
        })
        commit('SET_PEER', peer1)
        commit('SET_CALLING_USER', user)
        commit('SET_MYSTREAM', stream)
    })
}

export const acceptCall = ({commit, state}, {fromUser, signalData}) => {
    const mediaHandler = new MediaHander;
    mediaHandler.getPermissions().then((stream) => {

        const peer2 = new Peer({
            trickle: false,
            stream: stream,
            // config: { 
            //     iceServers: [
            //         {
            //             urls: "stun:numb.viagenie.ca",
            //             username: "sultan1640@gmail.com",
            //             credential: "98376683"
            //         },
            //         {
            //             urls: "turn:numb.viagenie.ca",
            //             username: "sultan1640@gmail.com",
            //             credential: "98376683"
            //         }
            //     ]
            // },
        })

        peer2.signal(signalData)
        peer2.on("signal", data => {
            const channel = Echo.private(`video-call.${fromUser.id}`)
            setTimeout(() => {
                channel.whisper('videoCallAccepted', {
                    fromUser: state.authUser,
                    signalData: data
                });
            }, 3000);
        })

        peer2.on('stream', stream => {
            commit('SET_OTHERSTREAM', stream)
        })

        commit('SET_PEER', peer2)
        commit('SET_CALLING_USER', fromUser)
        commit('SET_MYSTREAM', stream)
    })
}

export const callAccepted = ({commit, state}, {signalData}) => {
    const peer1 = state.peer
    peer1.signal(signalData)
    peer1.on('stream', stream => {
        commit('SET_OTHERSTREAM', stream)
    })
}

export const endCall = ({commit, state}, callingUser) => {
    const channel = Echo.private(`video-call.${callingUser.id}`)
    setTimeout(() => {
        channel.whisper('videoCallEnded', {
            fromUser: state.authUser,
        });
    }, 3000);
    commit('DESTROY_MYSTREAM')
}

export const toggleMic = ({commit}, status) => {
    commit('TOGGLE_MIC', status)
}

export const showCallRequestPopup = ({commit}) => {
    commit('SET_CALL_REQUEST_POPUP', true)
}

export const hideCallRequestPopup = ({commit}) => {
    commit('SET_CALL_REQUEST_POPUP', false)
}

export const rejectCall = ({state}, callingUser) => {
    const channel = Echo.private(`video-call.${callingUser.id}`)
    setTimeout(() => {
        channel.whisper('videoCallRejected', {
            fromUser: state.authUser,
        });
    }, 3000);
}

export const callRejected = ({commit}) => {
    commit('DESTROY_MYSTREAM')
}

export const callEnded = ({commit}) => {
    commit('SET_CALL_REQUEST_POPUP', false)
    commit('DESTROY_MYSTREAM')
}