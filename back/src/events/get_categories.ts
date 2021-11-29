import { Socket } from "socket.io";

import { getCategories } from "../db"
import capitalize from "../functions/capitalize";

export default function GetCategories(socket: Socket) {
  /**
   * When someone ask for Categories
   */

  socket.on("GET CATEGORIES", async function () {
    const categories = await getCategories() 
    socket.emit("CATEGORIES", categories.map(e =>  capitalize(e.category) ));
  });
}
