import { Room } from "../types"

export default function getPublicRooms(Rooms: Map<number, Room>) {
    const rooms = Array.from(Rooms, ([key, val]) => (val))
    const formattedRooms = rooms.filter(room => room.type == "public").map(room => {
        return {
            id: room.id,
            users: room.users,
            categories: room.categories,
            currentRound: room.currentRound,
            maxRounds: room.maxRounds,
            maxTime: room.maxTime,
            started: room.started
        }
    })
    return formattedRooms
}