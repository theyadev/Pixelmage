import { Socket } from "socket.io";

import { getCategories } from "../db"

function capitalize(str: string) {
    const split = str.split(" ")
    const capitalizedSplit = split.map(e => e[0].toUpperCase() + e.slice(1).toLowerCase())
    return capitalizedSplit.join(' ')
}

export default function GetCategories(socket: Socket) {
  /**
   * When someone ask for Categories
   */

  socket.on("GET CATEGORIES", async function () {
    const categories = await getCategories() 
    socket.emit("CATEGORIES", categories.map(e =>  capitalize(e.category) ));
  });
}
