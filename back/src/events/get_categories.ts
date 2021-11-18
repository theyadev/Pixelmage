import { Socket } from "socket.io";

import { query } from "../db"

function capitalize(str: string) {
    const split = str.split(" ")
    const capitalizedSplit = split.map(e => e[0].toUpperCase() + e.slice(1).toLowerCase())
    return capitalizedSplit.join(' ')
}

export default function getCategories(socket: Socket) {
  /**
   * When someone ask for Categories
   */

  socket.on("GET CATEGORIES", async function () {
    const categories = await query("SELECT * FROM categories")      
    socket.emit("CATEGORIES", categories.rows.map(e =>  capitalize(e.category) ));
  });
}
