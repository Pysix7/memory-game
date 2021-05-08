NODE 
Test case :
1. select difficulty -: easy(5), medium(10), hard(25)
2. api to server with difficulty. 
3. initiate game with UNIQUE file_id.
4. create a file to keep track of progess with file_id as under ~/root/game-boards/file_id.json
5. return file_id to client.( all proceeding requests should include this file_id)
6. client should display all cards in closed state.


`progress data structure`:
```js
{
    "id": string - unique_id,
    "start_time": number - date TS,
    "end_time": number - date TS,
    "error_score" : number,
    "difficulty": "easy" | "medium" | "hard",
    "card-picks": array of objects - [
        {
            "round":number,
            "selectedCards": [string],
            "validation": boolean,
        }
    ],
}
```

images for cards : 
- store 25 images urls.

card data structure when requested: server
```js
{
    "id": string,
    "image-url": string,
    "unique_card_id":string
}
```

card data structure: client
```js
{
    "id": "unique_card_id" - string,
    "url": string,
}
```

using WEBSOCKET:

algorithm server:
initialize game:
1. recieved initialize game request with difficulty.
2. generate unique file_id.
3. create a file like this ~/root/game-boards/`file_id`.json to save progress with `progress data structure`.
4. generate difficulty * 2 cards store in memory along with file_id and return cards.

