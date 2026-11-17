var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ...
 * @author
 */
var BoardLayoutRow = /** @class */ (function () {
    function BoardLayoutRow(startX, count, y, z, prepend) {
        if (prepend === void 0) { prepend = false; }
        this.prepend = prepend;
        this.count = count;
        this.z = z;
        this.y = y;
        this.endX = startX - 1 + count;
        this.startX = startX;
        if (BoardLayoutRow.rowLayoutVec == null) {
            BoardLayoutRow.rowLayoutVec = new Array();
        }
        BoardLayoutRow.rowLayoutVec.push(this);
    }
    return BoardLayoutRow;
}());
/**
 * ...
 * @author
 */
var BoardManager = /** @class */ (function () {
    function BoardManager() {
    }
    BoardManager.resetBoard = function () {
        GameUI.resetUI();
        this.removeAlltiles();
        BoardManager.createBoard();
    };
    BoardManager.removeAlltiles = function () {
        Tile.lastRemovedPiecesStack = new Array();
        this.resetBoardFlag = false;
        console.log("reset board called");
        var i = Tile.allTileArray.length;
        while (i-- > 0) {
            Tile.allTileArray[i].remove(true);
        }
    };
    BoardManager.createBoard = function () {
        console.log("create board called");
        BoardManager.initLayoutScheme();
        BoardManager.selectedTile = null;
        GameContext.gameState = GameContext.STATE_PLAYING;
        BoardManager.tileCountArray = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1];
        BoardManager.tileContainerArr = new Array();
        var arr = BoardLayoutRow.rowLayoutVec;
        var i = arr.length;
        while (i-- > 0) {
            var row = arr[i];
            var j = Math.round(row.count);
            while (j-- > 0) {
                var tileXCoord = row.startX + Math.round(row.count) - j - 1;
                // var tileXCoord:number = row.startX + j;
                var tile = new Tile(tileXCoord, row.y, row.z, row.prepend);
                BoardManager.assignFace(tile);
                // console.log(tileXCoord, row.y, row.z)
            }
        }
        i = 10;
        while (i-- > 0)
            BoardManager.rehash();
        BoardManager.solveAndRehash();
        this.resetPairing();
        if (BoardManager.resetBoardFlag) {
            BoardManager.resetBoard();
            return;
        }
        BoardManager.boardAnimationInitialized = false;
        if (GameContext.firstBoard) {
            BoardManager.initialBoardAnimation();
        }
        else {
            //secondaryBoardAnimation();
        }
        GameContext.firstBoard = false;
        BoardManager.getOpenMatches();
        BoardManager.saveBoardSetup();
    };
    BoardManager.saveBoardSetup = function () {
        this.savedBoardSetup = new Array();
        var i = Tile.allTileArray.length;
        console.log("save setup len: " + i);
        while (i-- > 0) {
            var t = Tile.allTileArray[i];
            var tileData = new TileData(t.boardXCoord, t.boardYCoord, t.boardZCoord, t.prepend, t.retFaceIdx, t.interMatchedType, t.graphicsName);
            this.savedBoardSetup.push(tileData);
        }
    };
    BoardManager.loadBoardSetup = function () {
        var i = this.savedBoardSetup.length;
        console.log("load board setup: " + i);
        while (i-- > 0) {
            // console.log("load boardsetup: " + i)
            var tData = this.savedBoardSetup[i];
            // console.log(tData.tileX, tData.tileY, tData.tileZ)
            var newTile = new Tile(tData.tileX, tData.tileY, tData.tileZ, tData.prepend);
            // console.log("new tile generated")
            // BoardManager.assignFace(newTile)
            // console.log("face assigned")
            newTile.assignFaceIdx(tData.retFaceIdx, tData.interMatchedType, tData.graphicsName);
        }
        this.placeAllTilesOnCorrectLayers();
    };
    BoardManager.restartSameBoard = function () {
        if (Tile.allTileArray.length < 144) {
        }
        GameUI.resetUI();
        SoundManager.playClick();
        this.removeAlltiles();
        this.loadBoardSetup();
        this.getOpenMatches();
    };
    BoardManager.mix = function () {
        // if (BoardManager.mixStarted) return;
        BoardManager.mixStarted = true;
        BoardManager.removeHint();
        BoardManager.deselect();
        var i = 10;
        while (i-- > 0) {
            this.rehash(true);
        }
        BoardManager.rehash(true);
        BoardManager.solveAndRehash(Tile.allTileArray.length);
        if (BoardManager.resetBoardFlag) {
            this.mix();
            return;
        }
        this.resetPairing();
        i = Tile.allTileArray.length;
        while (i-- > 0) {
            var t = Tile.allTileArray[i];
            t.tileShadow.alpha = 0;
            t.internalGroup.alpha = 0;
            var delayedCallTime = 1000 * (0.06 + t.boardXCoord * 0.02);
            t.secondaryTween(delayedCallTime);
        }
        SimpleGame.myGame.time.events.add(400, function () {
            BoardManager.mixStarted = false;
        });
        BoardManager.getOpenMatches();
        SoundManager.mix.play();
        Tile.lastRemovedPiecesStack = new Array();
    };
    BoardManager.deselect = function () {
        var i = Tile.allTileArray.length;
        while (i-- > 0) {
            Tile.allTileArray[i].deselect();
            // Tile.allTileArray[i].removeHint();
        }
    };
    BoardManager.initialBoardAnimation = function () {
        if (SimpleGame.myGame.device.iOS == false && SimpleGame.myGame.device.android == false && SimpleGame.myGame.device.chrome == false) {
            SoundManager.intro.play();
        }
        console.log("START INIT ANIMATION");
        var tiles = Tile.allTileArray;
        var i = tiles.length;
        while (i-- > 0) {
            var t = tiles[i];
            var tileXDelta = -2000;
            if (Math.random() < 0.5)
                tileXDelta = 2000;
            var tileYDelta = -2000;
            if (Math.random() < 0.5)
                tileYDelta = 2000;
            t.internalGroup.x += tileXDelta;
            t.internalGroup.y += tileYDelta;
            t.tileShadow.x += tileXDelta;
            t.tileShadow.y += tileYDelta;
            SimpleGame.myGame.add.tween(t.internalGroup).to({ x: t.internalGroup.x - tileXDelta, y: t.internalGroup.y - tileYDelta }, (0.25 + t.boardZCoord * 0.5 + t.boardYCoord * 0.1 + t.boardXCoord * 0.05) * 900, Phaser.Easing.Sinusoidal.InOut, true);
            SimpleGame.myGame.add.tween(t.tileShadow).to({ x: t.tileShadow.x - tileXDelta, y: t.tileShadow.y - tileYDelta }, (0.25 + t.boardZCoord * 0.5 + t.boardYCoord * 0.1 + t.boardXCoord * 0.05) * 900, Phaser.Easing.Sinusoidal.InOut, true);
        }
    };
    BoardManager.resetPairing = function () {
        console.log(Tile.allTileArray.length, BoardManager.tileContainerArr.length);
        Tile.allTileArray = Tile.allTileArray.concat(BoardManager.tileContainerArr);
        BoardManager.tileContainerArr = new Array();
        //trace("all tiles: " + Tile.allTileArray.length);
        var i = Tile.allTileArray.length;
        while (i-- > 0) {
            Tile.allTileArray[i].testPaired = false;
        }
    };
    BoardManager.assignFace = function (tile) {
        var retFaceIdx = 0;
        var done = false;
        do {
            done = false;
            var tileCountIdx = Math.floor(Math.random() * BoardManager.tileCountArray.length);
            if (BoardManager.last20Selected.indexOf(tileCountIdx) >= 0) {
                // console.log("in last 20 selected: ", tileCountIdx, BoardManager.tileCountArray[tileCountIdx])
                continue;
            }
            BoardManager.last20Selected.push(tileCountIdx);
            if (BoardManager.last20Selected.length > 5) {
                // console.log("remove from last 20")
                BoardManager.last20Selected.splice(0, 1);
            }
            // console.log(tileCountIdx, BoardManager.tileCountArray[tileCountIdx], BoardManager.last20Selected)
            if (BoardManager.tileCountArray[tileCountIdx] > 0) {
                done = true;
                BoardManager.tileCountArray[tileCountIdx]--;
                retFaceIdx = tileCountIdx;
            }
        } while (done == false);
        tile.assignFaceIdx(retFaceIdx, BoardManager.interMatchedType[retFaceIdx], BoardManager.tileNamesArray[retFaceIdx]);
    };
    BoardManager.initLayoutScheme = function () {
        BoardLayoutRow.rowLayoutVec = null;
        var r1 = new BoardLayoutRow(1, 12, 0, 0);
        var r2 = new BoardLayoutRow(3, 8, 1, 0);
        var r2 = new BoardLayoutRow(2, 10, 2, 0);
        var r2 = new BoardLayoutRow(1, 12, 3, 0);
        var r2 = new BoardLayoutRow(1, 12, 4, 0);
        var r2 = new BoardLayoutRow(0, 1, 3.5, 0, true);
        var r2 = new BoardLayoutRow(2, 10, 5, 0);
        var r2 = new BoardLayoutRow(3, 8, 6, 0);
        var r2 = new BoardLayoutRow(1, 12, 7, 0);
        var r2 = new BoardLayoutRow(4, 6, 1, 1);
        var r2 = new BoardLayoutRow(4, 6, 2, 1);
        var r2 = new BoardLayoutRow(4, 6, 3, 1);
        var r2 = new BoardLayoutRow(4, 6, 4, 1);
        var r2 = new BoardLayoutRow(4, 6, 5, 1);
        var r2 = new BoardLayoutRow(4, 6, 6, 1);
        var r2 = new BoardLayoutRow(5, 4, 2, 2);
        var r2 = new BoardLayoutRow(5, 4, 3, 2);
        var r2 = new BoardLayoutRow(5, 4, 4, 2);
        var r2 = new BoardLayoutRow(5, 4, 5, 2);
        var r2 = new BoardLayoutRow(6, 2, 3, 3);
        var r2 = new BoardLayoutRow(6, 2, 4, 3);
        var r2 = new BoardLayoutRow(6.5, 1, 3.5, 4);
        var r2 = new BoardLayoutRow(13, 2, 3.5, 0);
        BoardLayoutRow.rowLayoutVec.reverse();
    };
    BoardManager.isValidSelection = function (givenTile) {
        var allTileArr = Tile.allTileArray;
        //check for layer above first, if its on top or partially on top then algorithm is done
        var zCoordToCheck = givenTile.boardZCoord + 1;
        var i = allTileArr.length;
        while (i-- > 0) {
            var tile = allTileArr[i];
            if (tile.markedForRemoval)
                continue;
            if (tile == givenTile)
                continue;
            if (tile.boardZCoord == zCoordToCheck) {
                if (Math.abs(tile.boardXCoord - givenTile.boardXCoord) < 1) {
                    if (Math.abs(tile.boardYCoord - givenTile.boardYCoord) < 1) {
                        return false;
                    }
                }
            }
        }
        //check for horizontal neighbours on same plane - if it has 2, its not valid, if it has 1 check
        var horizontalNeighbours = [false, false];
        var i = allTileArr.length;
        while (i-- > 0) {
            var tile = allTileArr[i];
            if (tile == givenTile)
                continue;
            if (tile.markedForRemoval)
                continue;
            //if (tile.selectedState) continue;
            if (tile.boardZCoord == givenTile.boardZCoord && Math.abs(tile.boardYCoord - givenTile.boardYCoord) < 1) {
                if (tile.boardXCoord - givenTile.boardXCoord == 1) {
                    horizontalNeighbours[1] = true;
                }
                if (tile.boardXCoord - givenTile.boardXCoord == -1) {
                    horizontalNeighbours[0] = true;
                }
            }
        }
        if (horizontalNeighbours[0] == true && horizontalNeighbours[1] == true) {
            return false;
        }
        else {
            return true;
        }
        //check for vertical neighobours on the same plane
        // var verticalNeighbours:Array<boolean> = [false, false];
        // var i:number = allTileArr.length;
        // while (i-- > 0)
        // {
        // 	var tile:Tile = allTileArr[i];
        // 	if (tile == givenTile) continue;
        // 	if (tile.selectedState) continue;
        // 	if (tile.markedForRemoval) continue;
        // 	if (tile.boardZCoord == givenTile.boardZCoord && Math.abs(tile.boardXCoord - givenTile.boardXCoord) < 1 )
        // 	{
        // 		if ( tile.boardYCoord - givenTile.boardYCoord == 1)
        // 		{
        // 			verticalNeighbours[1] = true;
        // 		}
        // 		if (tile.boardYCoord - givenTile.boardYCoord == -1)
        // 		{
        // 			verticalNeighbours[0] = true;
        // 		}
        // 	}
        // }
        // if (verticalNeighbours[0] == true && verticalNeighbours[1] == true)
        // {
        // 	return false;
        // }
        // return true; 
    };
    BoardManager.checkForPairing = function (tileForPairing, selectedTile) {
        //trace(tileForPairing.retFaceIdx, selectedTile.retFaceIdx);
        if (tileForPairing.retFaceIdx == selectedTile.retFaceIdx) {
            BoardManager.matchTiles(tileForPairing, selectedTile);
            return true;
        }
        else if (tileForPairing.interMatchedType == selectedTile.interMatchedType && tileForPairing.interMatchedType >= 0) {
            //trace("seasons and other stuff matched: " + tileForPairing.interMatchedType, selectedTile.interMatchedType);
            BoardManager.matchTiles(tileForPairing, selectedTile);
            return true;
        }
        return false;
    };
    BoardManager.update = function () {
        // console.log("console log")
        // if (this.isValidSelection(this))
        // {
        // }
        var i = Tile.allTileArray.length;
        while (i-- > 0) {
            if (this.isValidSelection(Tile.allTileArray[i])) {
                Tile.allTileArray[i].tileBaseImg.input.useHandCursor = true;
            }
            else {
                Tile.allTileArray[i].tileBaseImg.input.useHandCursor = false;
            }
        }
    };
    BoardManager.hint = function () {
        if (BoardManager.selectedTile) {
            BoardManager.selectedTile.deselect();
        }
        this.autoPairReal();
        BoardManager.getOpenMatches();
    };
    BoardManager.checkForPairingTest = function (tileForPairing, selectedTile) {
        if (tileForPairing.retFaceIdx == selectedTile.retFaceIdx) {
            // console.log("check test pairing success normal", tileForPairing.retFaceIdx, selectedTile.retFaceIdx);
            BoardManager.matchTilesTest(tileForPairing, selectedTile);
            return true;
        }
        else if (tileForPairing.interMatchedType == selectedTile.interMatchedType && tileForPairing.interMatchedType >= 0) {
            //  console.log("check test pairing success spring", tileForPairing.interMatchedType, selectedTile.interMatchedType);
            BoardManager.matchTilesTest(tileForPairing, selectedTile);
            return true;
        }
        return false;
    };
    BoardManager.checkForPairingTest2 = function (tileForPairing, selectedTile) {
        //trace("check for pairing test");
        if (tileForPairing.retFaceIdx == selectedTile.retFaceIdx) {
            //trace("check test pairing success normal", tileForPairing.retFaceIdx, selectedTile.retFaceIdx);
            //matchTilesTest(tileForPairing, selectedTile);
            return true;
        }
        else if (tileForPairing.interMatchedType == selectedTile.interMatchedType && tileForPairing.interMatchedType >= 0) {
            //trace("check test pairing success spring", tileForPairing.interMatchedType, selectedTile.interMatchedType);
            //matchTilesTest(tileForPairing, selectedTile);
            return true;
        }
        return false;
    };
    BoardManager.matchTilesTest = function (tileForPairing, selectedTile) {
        tileForPairing.testPaired = selectedTile.testPaired = true;
        Tile.allTileArray.splice(Tile.allTileArray.indexOf(tileForPairing), 1);
        Tile.allTileArray.splice(Tile.allTileArray.indexOf(selectedTile), 1);
        BoardManager.tileContainerArr.push(tileForPairing);
        BoardManager.tileContainerArr.push(selectedTile);
    };
    BoardManager.matchTiles = function (tileForPairing, selectedTile) {
        SoundManager.match.play('', 0.15);
        // SoundManager.match.currentTime = 700000
        // SoundManager.match.update()
        tileForPairing.matched();
        selectedTile.matched();
        BoardManager.selectedTile = null;
    };
    BoardManager.autoPair = function () {
        // console.log("autopair check game over");
        var arr = Tile.allTileArray;
        var i = arr.length;
        var validTiles = new Array();
        while (i-- > 0) {
            var tile = arr[i];
            if (BoardManager.isValidSelection(tile) && tile.testPaired == false) {
                validTiles.push(tile);
            }
        }
        validTiles = Phaser.ArrayUtils.shuffle(validTiles);
        //trace("valid tiles: " + validTiles.length);
        i = validTiles.length;
        while (i-- > 0) {
            var tile = validTiles[i];
            var j = validTiles.length;
            while (j-- > 0) {
                if (i <= j)
                    continue;
                var tile2 = validTiles[j];
                if (BoardManager.checkForPairingTest(tile, tile2)) {
                    // console.log("AUTOPAIR SUCCESS!!!!", tile.boardXCoord, tile.boardYCoord, tile.boardZCoord, tile2.boardXCoord, tile2.boardYCoord, tile2.boardZCoord);
                    return true;
                }
            }
        }
        // console.log("AUTOPAIR FAILED!!!!");
        return false;
    };
    BoardManager.autoPairReal = function () {
        //trace("autopair");
        var arr = Tile.allTileArray;
        var i = arr.length;
        var validTiles = new Array();
        while (i-- > 0) {
            var tile = arr[i];
            if (BoardManager.isValidSelection(tile)) {
                validTiles.push(tile);
            }
        }
        //trace("valid tiles: " + validTiles.length);
        i = validTiles.length;
        while (i-- > 0) {
            var tile = validTiles[i];
            var j = validTiles.length;
            while (j-- > 0) {
                if (i <= j)
                    continue;
                var tile2 = validTiles[j];
                if (BoardManager.checkForPairing(tile, tile2))
                    return true;
            }
        }
        return false;
    };
    BoardManager.checkIfGameOver = function () {
        console.log("check if game over" + GameContext.gameState);
        //trace("all tile array: " + Tile.allTileArray.length);
        if (Tile.allTileArray.length <= 0 && GameContext.gameState == GameContext.STATE_PLAYING) {
            console.log("VICTORY");
            // MainUI.myRef.showWinPrompt();
            GameContext.gameState = GameContext.STATE_DONE;
            var gameover = new GameWonPrompt();
        }
        else if (BoardManager.autoPairCheck() == false && GameContext.gameState == GameContext.STATE_PLAYING) {
            console.log("GAME OVER");
            // MainUI.myRef.showGameOverPrompt();
            GameContext.gameState = GameContext.STATE_DONE;
            var gameover = new NoMoreMoves();
        }
    };
    BoardManager.autoPairCheck = function () {
        //  console.log("autopair check game over");
        var arr = Tile.allTileArray;
        var i = arr.length;
        var validTiles = new Array();
        while (i-- > 0) {
            var tile = arr[i];
            if (BoardManager.isValidSelection(tile) && tile.testPaired == false) {
                validTiles.push(tile);
            }
        }
        //trace("valid tiles: " + validTiles.length);
        i = validTiles.length;
        while (i-- > 0) {
            var tile = validTiles[i];
            tile.testPaired = false;
            var j = validTiles.length;
            while (j-- > 0) {
                if (i <= j)
                    continue;
                var tile2 = validTiles[j];
                if (BoardManager.checkForPairingTest2(tile, tile2)) {
                    //trace("AUTOPAIR SUCCESS!!!!", tile.boardXCoord, tile.boardYCoord, tile.boardZCoord, tile2.boardXCoord, tile2.boardYCoord, tile2.boardZCoord);
                    return true;
                }
            }
        }
        //trace("AUTOPAIR FAILED!!!!");
        return false;
    };
    BoardManager.solveAndRehash = function (totalLen) {
        if (totalLen === void 0) { totalLen = 144; }
        var mainLoopCounter = 20;
        do {
            console.log("main loop counter: " + mainLoopCounter);
            var counter = 10;
            do {
                do {
                } while (BoardManager.autoPair());
                BoardManager.rehash();
                counter--;
                // console.log(BoardManager.countPaired())
            } while (BoardManager.countPaired() < totalLen && counter > 0);
            if (BoardManager.countPaired() < totalLen) {
                BoardManager.resetBoardFlag = true;
            }
            else {
                console.log("done!!!");
                BoardManager.resetBoardFlag = false;
                return;
            }
            BoardManager.resetPairing();
        } while (mainLoopCounter-- > 0);
    };
    BoardManager.rehash = function (alwaysRehash) {
        if (alwaysRehash === void 0) { alwaysRehash = false; }
        var i = 20;
        var tileArrLen = Tile.allTileArray.length;
        // console.log("rehash called, tile arr len: " + tileArrLen);
        if (alwaysRehash == false && (tileArrLen <= 6 || (tileArrLen > 30 && tileArrLen < 140)))
            return;
        while (i-- > 0) {
            var tile1 = null;
            var tile2 = null;
            do {
                tile1 = Tile.allTileArray[Math.floor(tileArrLen * Math.random())];
            } while (tile1 == null);
            do {
                tile2 = Tile.allTileArray[Math.floor(tileArrLen * Math.random())];
            } while (tile2 == null || tile2 == tile1);
            tile1.removeFace();
            tile2.removeFace();
            var tile1Idx = tile1.retFaceIdx;
            var tile1interMatchedType = tile1.interMatchedType;
            var tile1graphicsname = tile1.graphicsName;
            tile1.assignFaceIdx(tile2.retFaceIdx, tile2.interMatchedType, tile2.graphicsName);
            tile2.assignFaceIdx(tile1Idx, tile1interMatchedType, tile1graphicsname);
        }
        //trace("rehash ended");
    };
    BoardManager.countPaired = function () {
        return BoardManager.tileContainerArr.length;
    };
    BoardManager.displayHint = function () {
        console.log("display hint");
        var arr = Tile.allTileArray;
        var i = arr.length;
        var validTiles = new Array();
        while (i-- > 0) {
            var tile = arr[i];
            if (tile.hintedState == true) {
                return;
            }
            if (tile.wasHinted || tile.markedForRemoval) {
                continue;
            }
            if (BoardManager.isValidSelection(tile) && tile.testPaired == false) {
                validTiles.push(tile);
            }
        }
        i = validTiles.length;
        console.log("valid tiles: " + validTiles.length);
        var totalCount = 0;
        while (i-- > 0) {
            var tile = validTiles[i];
            var j = validTiles.length;
            while (j-- > 0) {
                if (i <= j)
                    continue;
                var tile2 = validTiles[j];
                if (BoardManager.checkForPairingTestWithoutRemoval(tile, tile2)) {
                    var k = validTiles.length;
                    while (k-- > 0) {
                        validTiles[k].deselect();
                    }
                    // SoundPlayer2.play("SOUNDS/SHUFFLE_NOTIFICATION");
                    tile.markForHint();
                    tile2.markForHint();
                    SoundManager.hint.play();
                    return;
                }
            }
        }
        BoardManager.getOpenMatches();
    };
    // finds and selects other hinted tile
    BoardManager.selectOtherHinted = function (tile) {
        console.log("select other hinted");
        var arr = Tile.allTileArray;
        var i = arr.length;
        while (i-- > 0) {
            if (arr[i] != tile && ((arr[i].retFaceIdx == tile.retFaceIdx) || (arr[i].interMatchedType == tile.interMatchedType && tile.interMatchedType >= 0))) {
                if (arr[i].wasHinted == false) {
                    console.log("it was not hinted");
                }
            }
            if (arr[i].wasHinted && arr[i] != tile && ((arr[i].retFaceIdx == tile.retFaceIdx) || (arr[i].interMatchedType == tile.interMatchedType && tile.interMatchedType >= 0))) {
                BoardManager.selectedTile = arr[i];
                console.log("selected tile found");
                return;
            }
            else if (arr[i] != tile) {
                arr[i].deselect();
            }
        }
    };
    BoardManager.hintedOnField = function () {
        var i = Tile.allTileArray.length;
        while (i-- > 0) {
            if (Tile.allTileArray[i].hintedState) {
                return true;
            }
        }
        return false;
    };
    BoardManager.removeHint = function () {
        console.log("remove all hints");
        var i = Tile.allTileArray.length;
        while (i-- > 0) {
            Tile.allTileArray[i].removeHint();
            Tile.allTileArray[i].wasHinted = false;
        }
    };
    BoardManager.checkForPairingTestWithoutRemoval = function (tileForPairing, selectedTile) {
        if (tileForPairing.retFaceIdx == selectedTile.retFaceIdx) {
            //trace("check test pairing success normal", tileForPairing.retFaceIdx, selectedTile.retFaceIdx);
            //matchTilesTestWithoutRemoval(tileForPairing, selectedTile);
            return true;
        }
        else if (tileForPairing.interMatchedType == selectedTile.interMatchedType && tileForPairing.interMatchedType >= 0) {
            //trace("check test pairing success spring", tileForPairing.interMatchedType, selectedTile.interMatchedType);
            //matchTilesTestWithoutRemoval(tileForPairing, selectedTile);
            return true;
        }
        return false;
    };
    BoardManager.matchTilesTestWithoutRemoval = function (tileForPairing, selectedTile) {
        tileForPairing.testPaired = selectedTile.testPaired = true;
    };
    BoardManager.undoMove = function () {
        BoardManager.removeHint();
        BoardManager.deselect();
        if (Tile.allTileArray.length >= 144)
            return;
        if (Tile.lastRemovedPiecesStack == null)
            return;
        if (Tile.lastRemovedPiecesStack.length <= 0)
            return;
        SoundManager.undo.play();
        var tile1 = Tile.lastRemovedPiecesStack.pop();
        var tile2 = Tile.lastRemovedPiecesStack.pop();
        if (tile1 == null || tile2 == null) {
            console.log("stack empty");
            return;
        }
        // SoundPlayer2.play("SOUNDS/UNDO");
        var newT1 = new Tile(tile1.boardXCoord, tile1.boardYCoord, tile1.boardZCoord, tile1.prepend);
        newT1.assignFaceIdx(tile1.retFaceIdx, tile1.interMatchedType, tile1.graphicsName);
        var newT2 = new Tile(tile2.boardXCoord, tile2.boardYCoord, tile2.boardZCoord, tile2.prepend);
        newT2.assignFaceIdx(tile2.retFaceIdx, tile2.interMatchedType, tile2.graphicsName);
        newT1.internalGroup.scale.set(0, 0);
        newT2.internalGroup.scale.set(0, 0);
        SimpleGame.myGame.add.tween(newT1.internalGroup.scale).to({ x: 1, y: 1 }, 0.33, Phaser.Easing.Back.Out, true);
        SimpleGame.myGame.add.tween(newT2.internalGroup.scale).to({ x: 1, y: 1 }, 0.33, Phaser.Easing.Back.Out, true);
        // newT1.parentSprite.scaleX.animateTo(1, 0.33, Ease.backOut);
        // newT2.parentSprite.scaleX.animateTo(1, 0.33, Ease.backOut);
        // newT1.parentSprite.scaleY.animateTo(1, 0.33, Ease.backOut);
        // newT2.parentSprite.scaleY.animateTo(1, 0.33, Ease.backOut);
        this.placeAllTilesOnCorrectLayers();
        // Tile.manageAllShadows();
        SimpleGame.myGame.time.events.add(100, function () {
            this.removeHint();
        }, this);
        BoardManager.getOpenMatches();
    };
    BoardManager.placeAllTilesOnCorrectLayers = function () {
        var currentZIndex = 0;
        var currentYIndex = -2;
        var currentXIndex = -2;
        var totalTilesToPlace = Tile.allTileArray.length;
        console.log("total tiles to place: " + totalTilesToPlace);
        do {
            var t = this.getTileByBoardCoord(currentXIndex, currentYIndex, currentZIndex);
            if (t != null) {
                console.log(currentXIndex, currentYIndex, currentZIndex, totalTilesToPlace);
                console.log("put on correct place: " + t);
                if (t.prepend) {
                    // console.log("prepend")
                    Tile.itemsLayerArray[t.boardZCoord].add(t.internalGroup);
                }
                else {
                    // console.log("append")
                    Tile.itemsLayerArray[t.boardZCoord].add(t.internalGroup);
                }
                t.internalGroup.parent.removeChild(t.internalGroup);
                Tile.itemsLayerArray[t.boardZCoord].addAt(t.internalGroup, Tile.itemsLayerArray[t.boardZCoord].length, false);
                totalTilesToPlace--;
            }
            currentYIndex += .5;
            if (currentYIndex > 15) {
                currentYIndex = -2;
                currentXIndex += 0.5;
                if (currentXIndex > 20) {
                    currentXIndex = -2;
                    currentZIndex++;
                }
            }
        } while (totalTilesToPlace > 0 && currentZIndex < 8);
    };
    BoardManager.getTileByBoardCoord = function (currentXIndex, currentYIndex, currentZIndex) {
        var i = Tile.allTileArray.length;
        while (i-- > 0) {
            if (currentXIndex == Tile.allTileArray[i].boardXCoord && currentYIndex == Tile.allTileArray[i].boardYCoord && currentZIndex == Tile.allTileArray[i].boardZCoord) {
                return Tile.allTileArray[i];
            }
        }
        return null;
    };
    BoardManager.getOpenMatches = function () {
        var totalMatches = 0;
        var arr = Tile.allTileArray;
        var i = arr.length;
        while (i-- > 0) {
            var t = arr[i];
            if (BoardManager.isValidSelection(t) == false)
                continue;
            var j = arr.length;
            while (j-- > 0) {
                if (i == j)
                    continue;
                var t2 = arr[j];
                if (BoardManager.isValidSelection(t2) == false)
                    continue;
                if (BoardManager.checkForPairingTestWithoutRemoval(t, t2)) {
                    totalMatches++;
                }
            }
        }
        GameUI.matchesOnBoard = Math.floor(totalMatches / 2);
    };
    BoardManager.tileNamesArray = ["bamboo_01", "bamboo_02", "bamboo_03", "bamboo_04", "bamboo_05", "bamboo_06", "bamboo_07", "bamboo_08", "bamboo_09", "symbols_01", "symbols_02", "symbols_03", "symbols_04", "symbols_05", "symbols_06", "symbols_07", "symbols_08", "symbols_09", "dot_01", "dot_02", "dot_03", "dot_04", "dot_05", "dot_06", "dot_07", "dot_08", "dot_09", "dragon_green", "dragon_red", "dragon_white", "wind_east", "wind_north", "wind_south", "wind_west", "flowers_bamboo", "flowers_chrysantium", "flowers_orchid", "flowers_plum", "seasons_autumn", "seasons_spring", "seasons_summer", "seasons_winter"];
    BoardManager.interMatched = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true];
    BoardManager.interMatchedType = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 1, 1, 1, 1];
    BoardManager.boardAnimationInitialized = false;
    BoardManager.resetBoardFlag = false;
    BoardManager.last20Selected = new Array();
    BoardManager.mixStarted = false;
    return BoardManager;
}());
var Consts = /** @class */ (function () {
    function Consts() {
    }
    Consts.DELAY_BETWEEN_EVENTS_TOUCH = 200;
    Consts.DELAY_BETWEEN_EVENTS_DESKTOP = 100;
    Consts.timeToHint = 350;
    Consts.GAMETIME_EASY = 10 * 60;
    Consts.GAMETIME_MEDIUM = 12 * 60;
    Consts.GAMETIME_HARD = 15 * 60;
    return Consts;
}());
var WebFontConfig = {
    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function () {
        console.log("loadgoooglefonts");
        SimpleGame.myGame.time.events.add(2000, function () {
            SimpleGame.fontsLoadedFlag = true;
        }, this);
    },
    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ["Roboto:400,500,600,700,800"]
    }
};
var mouseIsWithinGame;
var SimpleGame = /** @class */ (function () {
    function SimpleGame() {
        // create our phaser game
        // 800 - width
        // 600 - height
        // Phaser.AUTO - determine the renderer automatically (canvas, webgl)
        // 'content' - the name of the container to add our game to
        // { preload:this.preload, create:this.create} - functions to call for our states
        this.mouseMovedWithinGameTicks = 0;
        this.ticks = 0;
        var config = {
            width: 800,
            height: 600,
            renderer: Phaser.CANVAS,
            parent: 'content',
            disableVisibilityChange: true
        };
        document.body.addEventListener('click', function () {
            var context = new AudioContext();
            // Setup all nodes
            SimpleGame.myGame.sound.context.resume();
        });
        this.game = new Phaser.Game(config);
        SimpleGame.myGame = this.game;
        // this.game.stage.backgroundColor = 0xffffff;
        // SimpleGame.myGame.stage.visible = false;
        if (SimpleGame.isReleaseVersion) {
            console.log = function () { };
        }
        // SimpleGame.myGame.stage.smoothed = true;
        this.boot = new Phaser.State();
        this.game.state.add("Boot", this.boot, true);
        this.gamestate = new Phaser.State();
        this.gamestate.preload = this.preload;
        this.gamestate.create = this.create;
        this.gamestate.update = this.update;
        this.gamestate.render = this.render;
        this.game.state.add("Gamestate", this.gamestate, false);
        var resizeF = function () {
            console.log("resize game");
            var deviceWidth = window.outerWidth;
            var deviceHeight = window.outerHeight;
            if (SimpleGame.myGame.device.desktop == false) {
                var scaleX = deviceWidth / 800;
                var scaleY = deviceHeight / 600;
                var scale = Math.min(scaleX, scaleY);
                SimpleGame.myGame.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                SimpleGame.myGame.scale.setUserScale(scale, scale);
                console.log("set to user scale: " + scale, scaleX, scaleY);
                SimpleGame.myGame.scale.pageAlignHorizontally = true;
            }
            else {
                SimpleGame.myGame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                SimpleGame.myGame.scale.pageAlignVertically = true;
                SimpleGame.myGame.scale.pageAlignHorizontally = true;
            }
            SimpleGame.myGame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            SimpleGame.myGame.scale.pageAlignVertically = true;
            SimpleGame.myGame.scale.pageAlignHorizontally = true;
            SimpleGame.myGame.scale.refresh();
            // Phaser.Canvas.setImageRenderingCrisp(SimpleGame.myGame.canvas);
            // SimpleGame.myGame.renderer.renderSession.roundPixels = true;
        };
        this.boot.preload = function () {
            this.game.load.image('logo', "assets/SPLASH.png");
            this.game.stage.backgroundColor = 0xffffff;
            // this.game.scale.pageAlignVertically = true;
            // this.game.scale.pageAlignHorizontally = true;
            // SimpleGame.myGame.input.mspointer.stop()
            window.addEventListener("resize", resizeF);
            // SimpleGame.myGame.stage.disableVisibilityChange = true;
            resizeF();
            // console.log("scale mode: " + this.game.scale.scaleMode);
            this.game.time.advancedTiming = true;
            // this.game.scale.setMinMax(0, 0, window.innerWidth, window.innerHeight);
            this.game.scale.refresh();
            console.log("height: " + window.innerHeight + ", " + window.innerWidth + ", " + this.game.height + "," + this.game.scale.sourceAspectRatio);
            // console.log(window.screen.width, window.screen.height)
            // console.log(window.outerWidth, window.outerHeight)
        };
        this.boot.create = function () {
            // SimpleGame.logo = this.game.add.sprite( 0, 0, 'logo' );
            // SimpleGame.logo.visible = true;
            this.game.state.start("Gamestate");
        };
        console.log(Phaser.VERSION);
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.script('webfont', '_ext/ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js');
        // add our logo image to the assets class under the
        // key 'logo'. We're also setting the background colour
        // so it's the same as the background colour in the image
        SimpleGame.logo = this.game.add.sprite(0, 0, 'logo');
        SimpleGame.logo.visible = false;
        var preload = new Preload();
        // SimpleGame.logo.visible = true;
        Tile.preload();
        // this.game.load.atlasXML('animation','assets/animation.png','assets/animation.xml')
        this.game.load.image('game_bg', "assets/game_bg.jpg");
        this.game.load.image('TURN', "assets/TURN.png");
        // this.game.load.image('shadow', "assets/shadow.png")
        // this.game.load.image('prompt_bg', "assets/prompt_bg.png")
        // this.game.load.image('smoke', "assets/smoke.png")
        this.game.load.image('ShadowBottom', "assets/TILES/shadowBottom.png");
        this.game.load.image('ShadowTop', "assets/TILES/shadowTop.png");
        // this.game.load.image('logo', "assets/SPLASH/logo.png")
        this.game.load.image('main_button_hint', "assets/BUTTONS/main_button_hint.png");
        this.game.load.image('main_button_hint_over', "assets/BUTTONS/main_button_hint_over.png");
        this.game.load.image('main_button_mix', "assets/BUTTONS/main_button_mix.png");
        this.game.load.image('main_button_mix_over', "assets/BUTTONS/main_button_mix_over.png");
        this.game.load.image('main_button_new-game', "assets/BUTTONS/main_button_new-game.png");
        this.game.load.image('main_button_new-game_over', "assets/BUTTONS/main_button_new-game_over.png");
        this.game.load.image('main_button_restart-game', "assets/BUTTONS/main_button_restart-game.png");
        this.game.load.image('main_button_restart-game_over', "assets/BUTTONS/main_button_restart-game_over.png");
        this.game.load.image('main_button_soundoff', "assets/BUTTONS/main_button_soundoff.png");
        this.game.load.image('main_button_soundoff_over', "assets/BUTTONS/main_button_soundoff_over.png");
        this.game.load.image('main_button_soundon', "assets/BUTTONS/main_button_soundon.png");
        this.game.load.image('main_button_soundon_over', "assets/BUTTONS/main_button_soundon_over.png");
        this.game.load.image('main_button_undo', "assets/BUTTONS/main_button_undo.png");
        this.game.load.image('main_button_undo_over', "assets/BUTTONS/main_button_undo_over.png");
        this.game.load.image('prompt_button_over', "assets/PROMPT/prompt_button_over.png");
        this.game.load.image('prompt_button', "assets/PROMPT/prompt_button.png");
        this.game.load.image('prompt_out_of_moves', "assets/PROMPT/prompt_out_of_moves.png");
        this.game.load.image('prompt_won', "assets/PROMPT/prompt_won.png");
        // this.game.load.image('button_hint', "assets/button_hint.png")
        // SimpleGame.myGame.load.spritesheet('reset', 'assets/reset.png', 37, 36, 4);
        // SimpleGame.myGame.load.spritesheet('volume', 'assets/volume.png', 47, 46, 2);
        console.log("load language.xml");
        this.game.load.xml('language', 'assets/language.xml');
        this.game.load.audio('click', ['assets/sounds/mouseclick.mp3', 'assets/SOUNDS/mouseclick.ogg']);
        this.game.load.audio('match', ['assets/sounds/match.mp3', 'assets/SOUNDS/match.ogg']);
        this.game.load.audio('no_more_moves', ['assets/sounds/no_more_matches.mp3', 'assets/SOUNDS/no_more_matches.ogg']);
        this.game.load.audio('hint', ['assets/sounds/hint.mp3', 'assets/SOUNDS/hint.ogg']);
        this.game.load.audio('intro', ['assets/sounds/intro.mp3', 'assets/SOUNDS/intro.ogg']);
        this.game.load.audio('invalid_move', ['assets/sounds/invalid_move.mp3', 'assets/SOUNDS/invalid_move.ogg']);
        this.game.load.audio('undo', ['assets/sounds/undo.mp3', 'assets/SOUNDS/undo.ogg']);
        this.game.load.audio('won', ['assets/sounds/won.mp3', 'assets/SOUNDS/won.ogg']);
        this.game.load.audio('mix', ['assets/sounds/mix.mp3', 'assets/SOUNDS/mix.ogg']);
    };
    SimpleGame.prototype.render = function () {
        // this.game.debug.text( ""+SimpleGame.debugTxt, 10, 10 );
    };
    SimpleGame.prototype.create = function () {
        SimpleGame.myGame.renderer.renderSession.roundPixels = false;
        // add the 'logo' sprite to the game, position it in the
        // center of the screen, and set the anchor to the center of
        // the image so it's centered properly. There's a lot of
        // centering in that last sentence
        // SoundManager.beginAnimation = this.game.add.audio('begin_animation')
        SoundManager.clearrow = this.game.add.audio('clearrow');
        SoundManager.click = this.game.add.audio('click');
        // SoundManager.click = this.game.add.audio('click')
        SoundManager.fail = this.game.add.audio('fail');
        SoundManager.grabcard = this.game.add.audio('grabcard');
        SoundManager.valid = this.game.add.audio('valid');
        SoundManager.won = this.game.add.audio('won');
        SoundManager.dealcards = this.game.add.audio('deal1card');
        SoundManager.hint = this.game.add.audio('hint');
        // SoundManager.noMoreHints = this.game.add.audio('no-more-hints')
        SoundManager.lost = this.game.add.audio('lost');
        SoundManager.beep = this.game.add.audio('beep');
        SoundManager.match = this.game.add.audio('match');
        SoundManager.no_more_moves = this.game.add.audio('no_more_moves');
        SoundManager.eruption = this.game.add.audio('eruption');
        SoundManager.intro = this.game.add.audio('intro');
        SoundManager.invalid_move = this.game.add.audio('invalid_move');
        SoundManager.undo = this.game.add.audio('undo');
        SoundManager.mix = this.game.add.audio('mix');
        // SoundManager.won = this.game.add.audio('invalid_move')
        // SoundManager.noMoreHints = this.game.add.audio('deal1card')
        SimpleGame.myGame.scale.forceOrientation(true, false);
        SimpleGame.myGame.scale.enterIncorrectOrientation.add(function () {
            SimpleGame.myGame.time.events.add(1, function () {
                var deviceWidth = window.innerWidth;
                var deviceHeight = window.innerHeight;
                // SimpleGame.myGame.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
                // SimpleGame.myGame.scale.refresh()
                var isIframed = false;
                if (window.self !== window.top) {
                    isIframed = true;
                }
                if (isIframed)
                    return;
                console.log("add turn image 1");
                // SimpleGame.myGame.scale.setGameSize(window.innerWidth, window.innerHeight)
                // SimpleGame.myGame.scale.currentScaleMode = Phaser.ScaleManager.NO_SCALE
                // SimBpleGame.myGame.renderer.resize(window.innerWidth,window.innerHeight)
                // this.turnImage = SimpleGame.myGame.add.image(SimpleGame.myGame.height/2,SimpleGame.myGame.width/2,'TURN');
                // this.turnImage.anchor.set(0.5,0.5)
                if (this.turnImage)
                    this.turnImage.destroy();
                this.turnImage = SimpleGame.myGame.add.image(0, 0, 'TURN');
                this.turnImage.width = 800;
                this.turnImage.height = 600;
                // this.turnImage.scaleX = this.game.height / this.turnImage.width;
                // this.turnImage.scaleY = this.game.width / this.turnImage.height;
                SimpleGame.myGame.input.enabled = false;
                // this.turnImage.rotation = Math.PI/2;
                var splash = document.getElementById('splash');
                if (splash) {
                    splash.parentNode.removeChild(splash);
                }
            }, this);
        }, this);
        SimpleGame.myGame.scale.leaveIncorrectOrientation.add(function () {
            // console.log(window.innerWidth, window.innerHeight, window.outerWidth, window.outerHeight)
            // SimpleGame.myGame.scale.setGameSize(880, 600)
            var deviceWidth = window.outerWidth;
            var deviceHeight = window.outerHeight;
            SimpleGame.myGame.input.enabled = true;
            if (this.turnImage) {
                this.turnImage.destroy();
            }
            if (deviceWidth < deviceHeight) {
            }
            else {
            }
            // this.whitefg.destroy();
        }, this);
        SoundManager.init();
        SimpleGame.handleOrientation();
        this.ticks = 0;
        var text = this.game.add.text(870, 32, '', { font: "35px Comic Sans MS", fill: "#ff0000" });
        text.text = "super";
        // this.game.physics.enable(logo, Phaser.Physics.ARCADE);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        var key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        var key3 = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
        var key4 = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        var key5 = this.game.input.keyboard.addKey(Phaser.Keyboard.U);
        var sBind;
        key5.onDown.add(function () {
            // BoardManager.autoPair()
            // console.log( "autopair: " + BoardManager.autoPairCheck() )
            BoardManager.undoMove();
            // console.log(Tile.allTileArray.length)
        });
        key3.onDown.add(function () {
            // BoardManager.autoPair()
            // console.log( "autopair: " + BoardManager.autoPairCheck() )
            BoardManager.displayHint();
            // console.log(Tile.allTileArray.length)
        });
        key4.onDown.add(function () {
            BoardManager.mix();
            console.log(Tile.allTileArray.length);
        });
        key1.onDown.add(function () {
            sBind = key2.onDown.add(function () {
                // BoardManager.Undo();
            }, this);
            // BoardManager.Undo()
        }, this);
        key1.onUp.add(function () {
            sBind.detach();
        });
        text.visible = false;
        SimpleGame.game_bg = this.game.add.sprite(0, 0, 'game_bg');
        SimpleGame.game_bg.width = 800;
        SimpleGame.game_bg.height = 600;
        SimpleGame.game_bg.visible = false;
        console.log("check assets loaded");
        // checkAssetsLoaded();
        SimpleGame.checkAssetsLoaded();
        SimpleGame.myGame.input.onUp.add(SimpleGame.onPointerUp, this);
        SimpleGame.myGame.input.onDown.add(SimpleGame.onPointerDown, this);
        //   SimpleGame.myGame.input.mspointer.capture = false;	
        SimpleGame.myGame.stage.disableVisibilityChange = true;
        document.addEventListener('contextmenu', function (event) { return event.preventDefault(); });
        // Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)
        // Phaser.Canvas.
        // SimpleGame.myGame.stage.smoothed = true;
        SimpleGame.myGame.stage.disableVisibilityChange = true;
        SimpleGame.myGame.renderer.renderSession.roundPixels = true;
    };
    SimpleGame.handleOrientation = function () {
        SimpleGame.myGame.scale.forceOrientation(true, false);
        SimpleGame.myGame.scale.enterIncorrectOrientation.add(function () {
            SimpleGame.myGame.time.events.add(1, function () {
                var deviceWidth = window.innerWidth;
                var deviceHeight = window.innerHeight;
                // SimpleGame.myGame.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
                // SimpleGame.myGame.scale.refresh()
                var isIframed = false;
                if (window.self !== window.top) {
                    isIframed = true;
                }
                if (isIframed)
                    return;
                console.log("add turn image");
                // SimpleGame.myGame.scale.setGameSize(window.innerWidth, window.innerHeight)
                // SimpleGame.myGame.scale.currentScaleMode = Phaser.ScaleManager.NO_SCALE
                // SimBpleGame.myGame.renderer.resize(window.innerWidth,window.innerHeight)
                // this.turnImage = SimpleGame.myGame.add.image(SimpleGame.myGame.height/2,SimpleGame.myGame.width/2,'TURN');
                // this.turnImage.anchor.set(0.5,0.5)
                if (this.turnImage)
                    this.turnImage.destroy();
                this.turnImage = SimpleGame.myGame.add.image(0, 0, 'TURN');
                this.turnImage.width = 880;
                this.turnImage.height = 600;
                // this.turnImage.scaleX = this.game.height / this.turnImage.width;
                // this.turnImage.scaleY = this.game.width / this.turnImage.height;
                SimpleGame.myGame.input.enabled = false;
                this.turnImage.alpha = 0.0001;
                // this.turnImage.rotation = Math.PI/2;
                var splash = document.getElementById('splash');
                if (splash) {
                    splash.parentNode.removeChild(splash);
                }
            }, this);
        }, this);
        SimpleGame.myGame.scale.leaveIncorrectOrientation.add(function () {
            // console.log(window.innerWidth, window.innerHeight, window.outerWidth, window.outerHeight)
            // SimpleGame.myGame.scale.setGameSize(880, 600)
            var deviceWidth = window.outerWidth;
            var deviceHeight = window.outerHeight;
            SimpleGame.myGame.input.enabled = true;
            if (this.turnImage) {
                this.turnImage.destroy();
            }
            if (deviceWidth < deviceHeight) {
            }
            else {
            }
            // this.whitefg.destroy();
        }, this);
    };
    SimpleGame.onPointerDown = function () {
        SimpleGame.pointerDown = true;
        //   console.log("input down")
        // if ( SimpleGame.myGame.device.android == true && SimpleGame.myGame.device.desktop == false && SimpleGame.myGame.scale.isFullScreen == false)
        // {
        // 	console.log("start full screen")
        // 	SimpleGame.myGame.scale.startFullScreen(false, false)
        // 	SimpleGame.myGame.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
        // }
    };
    SimpleGame.onPointerUp = function () {
        SimpleGame.pointerDown = false;
        //  console.log("input up")
    };
    SimpleGame.checkAssetsLoaded = function () {
        console.log("check assets loaded entered");
        if (SimpleGame.fontsLoadedFlag == false) {
            console.log("call checkAssetsLoaded in 0.05s");
            SimpleGame.myGame.time.events.add(50, function () {
                SimpleGame.checkAssetsLoaded();
            }, this);
        }
        else {
            console.log("add init screen in 1 second");
            // SimpleGame.myGame.time.events.add(1000, SimpleGame.addInitScreen, this);
            SimpleGame.addInitScreen();
        }
    };
    SimpleGame.addInitScreen = function () {
        var splash = document.getElementById('splash');
        if (splash) {
            splash.parentNode.removeChild(splash);
        }
        console.log("add init screen");
        SimpleGame.logo.visible = false;
        Language.initLanguage();
        SimpleGame.myGame.time.events.add(1, function () {
            // CardUtil.NUM_SUIT_COLORS = 2;
            // initmenugroup.removeAll(true);
            SimpleGame.startGame(true);
            GameUI.gameTime = Consts.GAMETIME_EASY;
            // GameUI.gameTime = 15;
            // InitMenuPrompt.startFullScreen = true;
            SimpleGame.myGame.time.events.add(350, function () {
                // InitMenuPrompt.startFullScreen = false;
            }, this);
        }, this);
    };
    SimpleGame.startGame = function (firstGame) {
        if (firstGame === void 0) { firstGame = true; }
        if (firstGame) {
            SimpleGame.gameEngineStarted = true;
            SimpleGame.game_bg.visible = true;
            SimpleGame.logo.visible = false;
            // Card.Init();
            GameUI.initialize();
            BoardManager.createBoard();
            console.log("easy game");
            GameUI.promptLayer.removeAll(true);
            // BoardManager.InitializeBoard();
            if (SimpleGame.myGame.device.safari == false && SimpleGame.myGame.device.firefox == false && SimpleGame.myGame.input.touch && (SimpleGame.myGame.device.android || SimpleGame.myGame.device.iOS)) {
                SimpleGame.myGame.input.mouse.stop();
            }
            else if (SimpleGame.myGame.device.safari == false && SimpleGame.myGame.device.firefox == false && SimpleGame.myGame.device.ie == false && SimpleGame.myGame.input.touch) {
                SimpleGame.myGame.input.mouse.stop();
            }
        }
        else {
            GameUI.resetMenuButton();
            GameUI.reinitData();
            BoardManager.resetBoard();
        }
        // if (SimpleGame.myGame.device.firefox)
        // {
        // 	SimpleGame.myGame.input.mouse.start()
        // }
    };
    SimpleGame.prototype.update = function () {
        //   console.log( SimpleGame.myGame.input.enabled)
        // if (SimpleGame.myGame.device.touch)
        // {
        // 	SimpleGame.myGame.input.mousePointer.en
        // }
        // SimpleGame.myGame.width = window.innerWidth
        // SimpleGame.myGame.height = window.innerHeight
        // SimpleGame.myGame.stage.width = window.innerWidth;
        // SimpleGame.myGame.stage.height = window.innerWidth;
        // if (this.whitefg)
        // {
        // 	this.game.world.bringToTop(this.whitefg)
        // }
        if (this.turnImage) {
            this.turnImage.bringToTop();
        }
        // console.log(SimpleGame.myGame.input.mspointer.capture)
        if (SimpleGame.gameEngineStarted == false)
            return;
        this.ticks++;
        var i = Tile.allTileArray.length;
        var selectedCardExists = false;
        while (i-- > 0) {
            // Tile.allTileArray[i].update();
            // if (Tile.allTileArray[i].selectedFlag)
            // {
            // 	selectedCardExists = true;
            // }
        }
        if (GameUI.promptLayer.countLiving() > 0) {
            //   console.log("prompt exists", this.ticks % 12, this.ticks)
            // SimpleGame.myGame.input.mspointer.capture = false;
            if (this.ticks % 120 == 1) {
                // SimpleGame.myGame.input.reset();
                // console.log("input reset")
            }
        }
        else {
            // SimpleGame.myGame.input.mspointer.capture = false;
        }
        GameUI.update();
        SimpleGame.myGame.input.update();
        BoardManager.update();
        // console.log(this.game.device.touch)
        // SimpleGame.myGame.input.mouse.enabled = !SimpleGame.myGame.device.mspointer;
        // this.game.debug.text("" + this.game.time.fps, 2, 14, "#00ff00"); 
        //  console.log(SimpleGame.myGame.input.activePointer.exists, SimpleGame.myGame.input.activePointer.withinGame, mouseIsWithinGame);
        var mouseIsMovedWithinGame;
        if (this.lastMouseCoordX != SimpleGame.myGame.input.x || this.lastMouseCoordY != SimpleGame.myGame.input.y) {
            mouseIsMovedWithinGame = true;
            this.mouseMovedWithinGameTicks++;
        }
        else {
            mouseIsMovedWithinGame = false;
            this.mouseMovedWithinGameTicks = 0;
        }
        this.lastMouseCoordX = SimpleGame.myGame.input.x;
        this.lastMouseCoordY = SimpleGame.myGame.input.y;
        if (SimpleGame.pointerDown == false && this.mouseMovedWithinGameTicks > 5 && SimpleGame.myGame.input.activePointer.withinGame == false) {
            // SimpleGame.unselectAllCards = true;
        }
        else {
            // SimpleGame.unselectAllCards = false;
        }
        // console.log("mouse moved within game: " + mouseIsMovedWithinGame)
        // console.log("unselect all cards: " + SimpleGame.unselectAllCards)
    };
    SimpleGame.fontsLoadedFlag = false;
    SimpleGame.gameEngineStarted = false;
    SimpleGame.unselectAllCards = false;
    SimpleGame.isReleaseVersion = false;
    SimpleGame.pointerDown = false;
    SimpleGame.debugTxt = "";
    return SimpleGame;
}());
function onLogoClicked() {
    // console.log("start fullscreen");
    // var card:Card = new Card(1,2);
    // this.game.scale.startFullScreen();
}
// when the page has finished loading, create our game
window.onload = function () {
    var game = new SimpleGame();
};
var GameContext = /** @class */ (function () {
    function GameContext() {
    }
    GameContext.STATE_PLAYING = 0;
    GameContext.STATE_DONE = 1;
    GameContext.firstBoard = true;
    return GameContext;
}());
var GameUI = /** @class */ (function () {
    function GameUI() {
    }
    GameUI.initialize = function () {
        GameUI.uiLayer = SimpleGame.myGame.add.group();
        Tile.shadow0 = SimpleGame.myGame.add.group();
        Tile.items0 = SimpleGame.myGame.add.group();
        Tile.shadow1 = SimpleGame.myGame.add.group();
        Tile.items1 = SimpleGame.myGame.add.group();
        Tile.shadow2 = SimpleGame.myGame.add.group();
        Tile.items2 = SimpleGame.myGame.add.group();
        Tile.shadow3 = SimpleGame.myGame.add.group();
        Tile.items3 = SimpleGame.myGame.add.group();
        Tile.shadow4 = SimpleGame.myGame.add.group();
        Tile.items4 = SimpleGame.myGame.add.group();
        GameUI.promptLayer = SimpleGame.myGame.add.group();
        GameUI.topLayer = SimpleGame.myGame.add.group();
        Tile.itemsLayerArray = [];
        Tile.shadowLayerArray = [];
        Tile.itemsLayerArray[0] = Tile.items0;
        Tile.itemsLayerArray[1] = Tile.items1;
        Tile.itemsLayerArray[2] = Tile.items2;
        Tile.itemsLayerArray[3] = Tile.items3;
        Tile.itemsLayerArray[4] = Tile.items4;
        Tile.shadowLayerArray[0] = Tile.shadow0;
        Tile.shadowLayerArray[1] = Tile.shadow1;
        Tile.shadowLayerArray[2] = Tile.shadow2;
        Tile.shadowLayerArray[3] = Tile.shadow3;
        Tile.shadowLayerArray[4] = Tile.shadow4;
        GameUI.matchesTxt = SimpleGame.myGame.make.text(40, 20, "0500", { font: "18px Roboto", fill: "#505a2b", fontWeight: "900", align: "Right" });
        GameUI.tilesTxt = SimpleGame.myGame.make.text(400, 20, "0500", { font: "18px Roboto", fill: "#505a2b", fontWeight: "900", align: "Right" });
        GameUI.timeTxt = SimpleGame.myGame.make.text(760, 20, "0500", { font: "18px Roboto", fill: "#505a2b", fontWeight: "900", align: "Right" });
        GameUI.matchesTxt.anchor.set(0, 0.5);
        GameUI.tilesTxt.anchor.set(0.5, 0.5);
        GameUI.timeTxt.anchor.set(1, 0.5);
        GameUI.gameboss = SimpleGame.myGame.make.graphics(0, 0);
        GameUI.gameboss.beginFill(0xffffff);
        GameUI.gameboss.drawRect(SimpleGame.myGame.width * 0.5 - 150, SimpleGame.myGame.height - 30, 300, 40);
        GameUI.gameboss.endFill();
        GameUI.gameboss.inputEnabled = true;
        GameUI.gameboss.events.onInputDown.add(ongamebossDown, this);
        GameUI.gameboss.events.onInputUp.add(ongamebossUp);
        GameUI.gameboss.alpha = 0.01;
        GameUI.gameboss.input.useHandCursor = true;
        window.addEventListener("click", onWindowClicked);
        var sButPlus = new SoundButton2(GameUI.uiLayer, "main_button_soundon", "main_button_soundon_over", "main_button_soundoff", "main_button_soundoff_over", 0, 600 - 3 * 71);
        GameUI.uiLayer.add(GameUI.matchesTxt);
        GameUI.uiLayer.add(GameUI.timeTxt);
        GameUI.uiLayer.add(GameUI.tilesTxt);
        GameUI.uiLayer.add(GameUI.gameboss);
        SimpleGame.myGame.time.events.loop(1000, GameUI.onSecondTick, this);
        GameUI.reinitData();
        var newgamebut = new ButtonWithOverState(GameUI.uiLayer, 'main_button_new-game', 'main_button_new-game_over', 0, 600 - 2 * 71, function () {
            // GameUI.resetMenuButton()
            GameUI.reinitData();
            BoardManager.resetBoard();
        });
        var restartbut = new ButtonWithOverState(GameUI.uiLayer, 'main_button_restart-game', 'main_button_restart-game_over', 0, 600 - 71, function () {
            BoardManager.restartSameBoard();
        });
        var hintbut = new ButtonWithOverState(GameUI.uiLayer, 'main_button_hint', 'main_button_hint_over', 800 - 54, 600 - 3 * 71, function () {
            BoardManager.displayHint();
        });
        //    var hintbut:ButtonWithOverState = new ButtonWithOverState(GameUI.uiLayer, 'button_hint', 'button_hint', 700-54, 600-3*71, function()
        // {
        //     BoardManager.displayHint()
        // })
        var undobut = new ButtonWithOverState(GameUI.uiLayer, 'main_button_undo', 'main_button_undo_over', 800 - 54, 600 - 2 * 71, function () {
            BoardManager.undoMove();
        });
        var mixbut = new ButtonWithOverState(GameUI.uiLayer, 'main_button_mix', 'main_button_mix_over', 800 - 54, 600 - 71, function () {
            BoardManager.mix();
        });
        mixbut.skipClickSound = true;
        undobut.skipClickSound = true;
        hintbut.skipClickSound = true;
        restartbut.skipClickSound = true;
        SimpleGame.myGame.time.events.add(3000, function () {
            // var gamewonprompt = new GameWonPrompt()
            // var stats = new StatisticsPrompt()
            // var moremovose = new NoMoreMoves()
            //   SoundManager.clearrow.play()
        }, this);
        //     SimpleGame.myGame.time.events.loop(1000, function()
        // {
        //     GameUI.time++;
        // }, this)
    };
    GameUI.addResetButtonEvents = function () {
        console.log("add button evets");
        // if (GameUI.reset.events.onInputDown.)
        // {
        //     return ;
        // }
    };
    GameUI.resetMenuButton = function () {
        GameUI.menuButton.input.reset();
        GameUI.menuButton.inputEnabled = true;
        GameUI.menuButton.events.onInputDown.add(GameUI.onMenuButtonPressed, this);
        GameUI.menuButton.events.onInputOver.add(function () {
            SimpleGame.myGame.canvas.style.cursor = "pointer";
            console.log("show pointer");
        }, GameUI.menuButton);
        GameUI.menuButton.events.onInputOut.add(function () {
            SimpleGame.myGame.canvas.style.cursor = "default";
        }, GameUI.menuButton);
        GameUI.uiLayer.add(GameUI.menuButton);
    };
    GameUI.resetUI = function () {
        GameUI.reinitData();
    };
    GameUI.onSecondTick = function () {
        BoardManager.checkIfGameOver();
        // console.log("second ticked")
        if (GameUI.gameStarted && GameUI.promptLayer.children.length <= 0) {
            GameUI.time++;
            var currentTime = GameUI.gameTime - GameUI.time;
            if (currentTime <= 10 && currentTime >= 1) {
                // SoundManager.beep.play()
            }
        }
    };
    GameUI.reinitData = function () {
        GameUI.score = 500;
        GameUI.time = 0;
        GameUI.moves = 0;
        GameUI.scoreTotal = GameUI.score;
        GameUI.gameStarted = true;
    };
    GameUI.update = function () {
        this.matchesTxt.text = Language.open_matches[Language.langIdx].toUpperCase() + this.matchesOnBoard;
        this.tilesTxt.text = Language.tiles_left[Language.langIdx].toUpperCase() + Tile.allTileArray.length;
        this.timeTxt.text = Language.time_played[Language.langIdx].toUpperCase() + Util.convertToHHMMSS(this.time);
    };
    GameUI.onMenuButtonPressed = function () {
        console.log("menu button is pressed");
        if (GameUI.gameStarted == false)
            return;
        // var mainmenu = new MainMenu()
        // GameUI.menuButton.input.useHandCursor = false;
        GameUI.menuButton.input.reset();
        SimpleGame.myGame.canvas.style.cursor = "default";
        SoundManager.playClick();
    };
    GameUI.gamebossPressed = false;
    GameUI.gameStarted = false;
    GameUI.matchesOnBoard = 0;
    return GameUI;
}());
function onWindowClicked() {
    //   console.log("window clicked")
    if (GameUI.gamebossPressed) {
        window.open("https://www.gameboss.com", "_blank");
    }
    // if (InitMenuPrompt.startFullScreen && SimpleGame.myGame.device.desktop == false)
    // {
    //     SimpleGame.myGame.scale.startFullScreen();
    //     SimpleGame.myGame.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    // }
    if (SimpleGame.myGame.device.android == true && SimpleGame.myGame.device.desktop == false && SimpleGame.myGame.scale.isFullScreen == false) {
        console.log("start full screen");
        SimpleGame.myGame.scale.startFullScreen(false, false);
        SimpleGame.myGame.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
}
function ongamebossDown() {
    console.log("gameboss is pressed");
    GameUI.gamebossPressed = true;
}
function ongamebossUp() {
    console.log("gameboss is unpressed");
    SimpleGame.myGame.time.events.add(350, function () {
        GameUI.gamebossPressed = false;
    });
}
/**
 * ...
 * @author
 */
var Language = /** @class */ (function () {
    function Language() {
    }
    Language.initLanguage = function () {
        var url = location.href.toString();
        console.log(url);
        var languageStr = url.split("lang=")[1];
        if (languageStr == null) {
            languageStr = "en";
        }
        languageStr = languageStr.toUpperCase();
        console.log("Language str: " + languageStr);
        //  trace(GameContext.pack.getFile("language.xml"));
        // var langXml:Xml = Xml.parse( GameContext.pack.getFile("language.xml").toString() );
        var langXml = SimpleGame.myGame.cache.getXML('language');
        console.log(langXml.getElementsByTagName("language"));
        console.log(langXml);
        Language.LanguageAbbrevations = [];
        Language.HOW_TO_PLAY_FULL = [];
        Language.NEW_GAME = [];
        Language.EASY = [];
        Language.NORMAL = [];
        Language.HARD = [];
        Language.PLAY = [];
        Language.TIME = [];
        Language.SCORE = [];
        Language.MENU = [];
        Language.RESUME = [];
        Language.RESTART = [];
        Language.YES = [];
        Language.NO = [];
        Language.KEEP_PLAYING = [];
        Language.ARE_YOU_SURE_RESTART = [];
        Language.ARE_YOU_SURE_NEW = [];
        Language.ARE_YOU_SURE_SHORT = [];
        Language.THERE_MUST_BE_AT_LEAST = [];
        Language.MORE_GAMES = [];
        Language.SOUND_ON = [];
        Language.SOUND_OFF = [];
        Language.MOVES = [];
        Language.YOUWONGAME = [];
        Language.DONTSHOWAGAIN = [];
        Language.STATISTICS = [];
        Language.SPIDER_SOLITAIRE = [];
        Language.ALLTIMESTATS = [];
        Language.playedgames = [];
        Language.wongames = [];
        Language.lostgames = [];
        Language.win_percentage = [];
        Language.top_score = [];
        Language.best_time = [];
        Language.ok = [];
        Language.with_a_score_of = [];
        Language.minutes_played = [];
        Language.themovesyoumade = [];
        Language.youralltimehigh = [];
        Language.replay = [];
        Language.clear = [];
        Language.level = [];
        Language.select_level = [];
        Language.congrats = [];
        Language.timebonus = [];
        Language.yourscore = [];
        Language.illegalmove = [];
        Language.best_score = [];
        Language.youlostgame = [];
        Language.totalscore = [];
        Language.nomoremoves = [];
        Language.open_matches = [];
        Language.nomoremoves_long = [];
        Language.shuffle = [];
        Language.time_played = [];
        Language.tiles_left = [];
        console.log("Language init done");
        for (var i = 0; i < langXml.getElementsByTagName("language").length; i++) {
            console.log("started for loop");
            Language.LanguageAbbrevations.push(langXml.getElementsByTagName("language")[i].attributes[0].nodeValue);
            Language.RESTART.push(Language.getCorrectTranslation("restart", langXml.getElementsByTagName("language")[i]));
            Language.YOUWONGAME.push(Language.getCorrectTranslation("youwongame", langXml.getElementsByTagName("language")[i]));
            Language.open_matches.push(Language.getCorrectTranslation("open_matches", langXml.getElementsByTagName("language")[i]));
            Language.best_time.push(Language.getCorrectTranslation("best_time", langXml.getElementsByTagName("language")[i]));
            Language.time_played.push(Language.getCorrectTranslation("time_played", langXml.getElementsByTagName("language")[i]));
            Language.nomoremoves_long.push(Language.getCorrectTranslation("nomoremoves_long", langXml.getElementsByTagName("language")[i]));
            Language.shuffle.push(Language.getCorrectTranslation("shuffle", langXml.getElementsByTagName("language")[i]));
            Language.nomoremoves.push(Language.getCorrectTranslation("nomoremoves", langXml.getElementsByTagName("language")[i]));
            Language.tiles_left.push(Language.getCorrectTranslation("tiles_left", langXml.getElementsByTagName("language")[i]));
        }
        Language.langIdx = Language.LanguageAbbrevations.indexOf(languageStr.toLowerCase());
    };
    Language.getCorrectTranslation = function (s, o) {
        console.log("get correct translation: " + s);
        return o.getElementsByTagName(s)[0].textContent;
    };
    Language.LanguageAbbrevations = ["EN", "NL", "FR", "DE", "IT", "PL"];
    Language.PLAY_SHORT = ["Play", "STARTEN", "JOUER", "Spielen", "Jugar", "Jucati"];
    Language.HOW_TO_PLAY_FULL = ["The goal in this Solitaire game is to move all the cards to the four empty stacks in order from ace to king. You can choose to deal 1 card at a time or 3."];
    return Language;
}());
var Preload = /** @class */ (function () {
    function Preload() {
        // this.gameovertxt = SimpleGame.myGame.make.text(400, 270, "Mah Jongg is loading ", {font: "20px Arial", fill: "#ffffff", fontWeight:"700", align:"Right"})     
        // this.gameovertxt.anchor.set(0.5, 0.5)
        // this.preloadLayer = SimpleGame.myGame.add.group();
        this.loaded = 0;
        // this.gameovertxt.stroke = '#000000'
        // this.gameovertxt.strokeThickness = 4
        // this.preloadLayer.add(this.gameovertxt);
        // SimpleGame.myGame.time.events.add(10, this.update, this)
        // this.loadingbar = SimpleGame.myGame.make.graphics(250,300)
        // this.loadingbar.beginFill(0xffffff)
        // this.loadingbar.drawRect(0, 0, 300,10)
        // this.loadingbar.endFill();
        // this.preloadLayer.add(this.loadingbar)
        SimpleGame.logo = SimpleGame.myGame.add.sprite(0, 0, 'logo');
        // SimpleGame.logo.visible = false;
    }
    Preload.prototype.update = function () {
        // this.loaded++;
        // if (this.loaded > 100)
        // {
        //     this.loaded = 100;
        // }
        // this.gameovertxt.text = "Loading: " + this.loaded + "%"
        // SimpleGame.myGame.time.events.add(3, this.update, this)
        // this.loadingbar.width = 3 * this.loaded
        // this.loadingbar.clear();
    };
    return Preload;
}());
var SoundManager = /** @class */ (function () {
    function SoundManager() {
    }
    SoundManager.playClick = function () {
        if (SoundManager.canPlayClick) {
            // SoundManager.click.startTime = 0.1;
            // SoundManager.click.position = SoundManager.click.duration-100;
            // SoundManager.click.update()
            console.log("play CLICK");
            SoundManager.click.play();
            SoundManager.canPlayClick = false;
            // console.log("cannot play click")
            SimpleGame.myGame.time.events.add(10, function () {
                // console.log("can play click")
                SoundManager.canPlayClick = true;
            }, this);
        }
    };
    SoundManager.init = function () {
        SoundManager.sManager = new Phaser.SoundManager(SimpleGame.myGame);
        SoundManager.dealcards.allowMultiple = true;
        SoundManager.hint.volume = 0.7;
        SoundManager.clearrow.volume = 0.7;
    };
    SoundManager.playGrabCard = function () {
        if (SoundManager.canPlayGrab) {
            //  console.log("play CLICK")
            SoundManager.grabcard.play();
            SoundManager.canPlayGrab = false;
            // console.log("cannot play click")
            SimpleGame.myGame.time.events.add(100, function () {
                // console.log("can play click")
                SoundManager.canPlayGrab = true;
            }, this);
        }
    };
    SoundManager.setMuteFlags = function (muteFlag) {
        // SoundManager.beginAnimation.mute = muteFlag;
        SoundManager.clearrow.mute = muteFlag;
        SoundManager.click.mute = muteFlag;
        SoundManager.fail.mute = muteFlag;
        SoundManager.grabcard.mute = muteFlag;
        SoundManager.valid.mute = muteFlag;
        SoundManager.won.mute = muteFlag;
        SoundManager.dealcards.mute = muteFlag;
        SoundManager.hint.mute = muteFlag;
        SoundManager.lost.mute = muteFlag;
        // SoundManager.beep.mute = muteFlag;
        SoundManager.no_more_moves.mute = muteFlag;
        SoundManager.match.mute = muteFlag;
        // SoundManager.eruption.mute = muteFlag;
        SoundManager.mix.mute = muteFlag;
        SoundManager.invalid_move.mute = muteFlag;
        // SoundManager.beginAnimation.mute = muteFlag;
    };
    SoundManager.playDealRow = function () {
        SoundManager.timesToPlayDealSound = 10;
        SoundManager.playDealRowSound();
    };
    SoundManager.playDealRowSound = function () {
        SoundManager.dealcards.position = 200;
        SoundManager.dealcards.update();
        SoundManager.dealcards.play();
        console.log("play dealcards");
        SoundManager.timesToPlayDealSound--;
        if (SoundManager.timesToPlayDealSound > 0) {
            SimpleGame.myGame.time.events.add(44, function () {
                SoundManager.playDealRowSound();
            });
        }
    };
    SoundManager.timesToPlayDealSound = 10;
    SoundManager.canPlayClick = true;
    SoundManager.canPlayGrab = true;
    return SoundManager;
}());
/**
 * ...
 * @author
 */
var Tile = /** @class */ (function () {
    function Tile(boardXCoord, boardYCoord, boardZCoord, prepend) {
        //  faceImgEnt:Entity;
        this.removalFlag = false;
        this.selectedState = false;
        this.testPaired = false;
        this.markedForRemoval = false;
        this.wasHinted = false;
        if (Tile.allTileArray == null) {
            Tile.allTileArray = new Array();
        }
        this.prepend = prepend;
        // console.log(boardXCoord, boardYCoord, boardZCoord, prepend)
        Tile.allTileArray.push(this);
        this.internalGroup = SimpleGame.myGame.make.group();
        if (prepend) {
            // console.log("prepend")
            Tile.itemsLayerArray[boardZCoord].addAt(this.internalGroup, 0);
        }
        else {
            // console.log("append")
            Tile.itemsLayerArray[boardZCoord].add(this.internalGroup);
        }
        this.boardZCoord = boardZCoord;
        this.boardYCoord = boardYCoord;
        this.boardXCoord = boardXCoord;
        this.tileBaseImg = SimpleGame.myGame.make.sprite(-500, -500, 'tile_blank');
        this.tileBaseImgSelected = SimpleGame.myGame.make.sprite(-500, -500, "tile_selected_blank");
        this.tileBaseHinted = SimpleGame.myGame.make.sprite(-500, -500, "tile_hint");
        if (this.boardZCoord == 0) {
            this.tileShadow = SimpleGame.myGame.make.sprite(-500, -500, 'ShadowBottom');
        }
        else {
            this.tileShadow = SimpleGame.myGame.make.sprite(-500, -500, 'ShadowTop');
        }
        this.tileBaseImg.inputEnabled = true;
        this.tileBaseImgSelected.inputEnabled = true;
        // console.log("tile created")
        Tile.shadowLayerArray[boardZCoord].add(this.tileShadow);
        this.internalGroup.add(this.tileBaseImg);
        this.tileBaseImg.anchor.set(0.5, 0.5);
        this.tileBaseImgSelected.anchor.set(0, 0);
        this.tileBaseImgSelected.alpha = 1;
        // this.tileBaseImg.width = 50
        // this.tileBaseImg.height = 66
        this.tileBaseImgSelected.width = this.tileBaseImg.width;
        this.tileBaseImgSelected.height = this.tileBaseImg.height;
        // this.tileShadow.width = this.tileBaseImg.width+10;
        // this.tileShadow.height = this.tileBaseImg.height+5;
        this.tileShadow.alpha = 1;
        SimpleGame.myGame.renderer.renderSession.roundPixels = true;
        this.tileBaseImgSelected.visible = false;
        this.tileBaseHinted.visible = false;
        this.placeToBoardCoords();
        this.tileBaseImg.events.onInputDown.add(this.switchToSelectedState, this, 200);
    }
    Tile.preload = function () {
        console.log("tile images preload");
        SimpleGame.myGame.load.image('tile_blank', 'assets/TILES/tile.png');
        SimpleGame.myGame.load.image('tile_selected_blank', 'assets/TILES/tile_select.png');
        SimpleGame.myGame.load.image('tile_hint', 'assets/TILES/tile_hint.png');
        var tilenamesArr = BoardManager.tileNamesArray;
        var i = tilenamesArr.length;
        while (i-- > 0) {
            SimpleGame.myGame.load.image(tilenamesArr[i].toString(), "assets/TILES/" + tilenamesArr[i] + ".png");
        }
        console.log("tile images preloaded done");
    };
    Tile.prototype.switchToSelectedState = function () {
        // if (this.inputBanned) return;
        // if (SimpleGame.myGame.device.touch == false)
        // {
        // 	SimpleGame.myGame.input.enabled = false;
        // 	SimpleGame.myGame.time.events.add(1, function()
        // {
        // 	SimpleGame.myGame.input.enabled = true;
        // }, this)
        // }
        // SimpleGame.myGame.input.mspointer.capture = true;
        console.log("switch to selected state: " + this.boardZCoord);
        if (this == BoardManager.selectedTile) {
            return;
        }
        if (this.removalFlag) {
            console.log("removal flag, skip select");
            return;
        }
        if (BoardManager.isValidSelection(this)) {
            console.log("selection valid");
            if (this.hintedState) {
                BoardManager.selectOtherHinted(this);
                BoardManager.removeHint();
            }
            else if (BoardManager.hintedOnField() && this.hintedState == false) {
            }
            BoardManager.removeHint();
            SoundManager.playClick();
            if (BoardManager.selectedTile != null) {
                console.log("clicked piece: " + this.boardXCoord, this.boardYCoord, this.boardZCoord);
                console.log("already selected piece: ", BoardManager.selectedTile.boardXCoord, BoardManager.selectedTile.boardYCoord, BoardManager.selectedTile.boardZCoord);
            }
            if (this.tileBaseImg.parent != null) {
                // console.log("can select");
                if (BoardManager.selectedTile == null) {
                    console.log("select");
                    // this.tileBaseImg.visible = false;
                    this.tileBaseImgSelected.visible = true;
                    this.tileBaseImg.visible = false;
                    if (SoundButton.soundFlag) {
                        // SoundPlayer2.play("SOUNDS/CLICK_TILE");
                    }
                    this.selectedState = true;
                    BoardManager.selectedTile = this;
                }
                else {
                    if (BoardManager.checkForPairing(this, BoardManager.selectedTile) == false) {
                        BoardManager.selectedTile.deselect();
                        this.switchToSelectedState();
                    }
                    else {
                        console.log("TILE MATCHED!");
                        SimpleGame.myGame.time.events.add(1, function () {
                            BoardManager.checkIfGameOver();
                        }, this);
                        // if (SoundButton.soundFlag) SoundPlayer2.play("SOUNDS/MATCH");
                        // if (SoundButton.soundFlag) SoundPlayer2.play("SOUNDS/CLICK_TILE");
                        BoardManager.selectedTile = null;
                    }
                }
            }
            else {
                this.deselect();
                //GameContext.pack.getSound("SOUNDS/NO_MATCH").play();
            }
        }
        else {
            this.invalidMove();
            // if (SoundButton.soundFlag) SoundPlayer2.play("SOUNDS/NO_MATCH");
        }
    };
    Tile.prototype.invalidMove = function () {
        SoundManager.invalid_move.play('', 0.15);
        this.internalGroup.x = -2;
        if (this.invalidTween != null) {
            this.invalidTween.stop(true);
        }
        this.invalidTween = SimpleGame.myGame.add.tween(this.internalGroup).to({ x: this.internalGroup.x + 2 }, 125, Phaser.Easing.Bounce.Out, true);
    };
    Tile.prototype.deselect = function () {
        console.log("deselect called!");
        this.selectedState = false;
        this.tileBaseImg.visible = true;
        this.tileBaseImgSelected.visible = false;
        BoardManager.selectedTile = null;
    };
    Tile.prototype.placeToBoardCoords = function () {
        this.tileBaseImg.x = 90 + (this.tileBaseImg.width - 3) * (this.boardXCoord) - 4 * this.boardZCoord;
        this.tileBaseImg.y = 93 + (this.tileBaseImg.height - 3) * (this.boardYCoord) - 4 * this.boardZCoord;
        this.tileBaseImgSelected.x = this.tileBaseImg.x - this.tileBaseImg.width / 2;
        this.tileBaseImgSelected.y = this.tileBaseImg.y - this.tileBaseImg.height / 2;
        this.tileShadow.x = this.tileBaseImgSelected.x - 15;
        this.tileShadow.y = this.tileBaseImgSelected.y - 15;
        this.tileBaseHinted.x = this.tileBaseImgSelected.x;
        this.tileBaseHinted.y = this.tileBaseImgSelected.y;
    };
    Tile.Initialize = function () {
        //trace("Tile initialize: " + GameConsts.WIDTH, GameConsts.HEIGHT, tileWidthMax, tileHeightMax); 
    };
    Tile.prototype.assignFaceIdx = function (retFaceIdx, interMatchedType, graphicsName) {
        this.graphicsName = graphicsName;
        this.interMatchedType = interMatchedType;
        this.retFaceIdx = retFaceIdx;
        this.faceImg = SimpleGame.myGame.make.sprite(0, 0, graphicsName);
        this.faceImg.anchor.set(0.5, 0.5);
        this.internalGroup.add(this.tileBaseImgSelected);
        this.internalGroup.add(this.tileBaseHinted);
        this.internalGroup.addAt(this.faceImg, 3);
        this.faceImg.anchor.set(0.5, 0.5);
        this.faceImg.x = this.tileBaseImg.x;
        this.faceImg.y = this.tileBaseImg.y;
    };
    Tile.prototype.remove = function (skipOpenMatches) {
        if (skipOpenMatches === void 0) { skipOpenMatches = false; }
        if (Tile.allTileArray.indexOf(this, 0) > -1) {
            Tile.allTileArray.splice(Tile.allTileArray.indexOf(this, 0), 1);
        }
        // if (this.tileBaseImg.parent)
        // {
        // 	this.tileBaseImg.removeChild(this.tileBaseImg)
        // }
        // if (this.tileBaseImgSelected.parent)
        // {
        // 	this.tileBaseImgSelected.removeChild(this.tileBaseImgSelected)
        // }
        // if (this.faceImg.parent)
        // {
        // 	this.faceImg.removeChild(this.faceImg)
        // }
        // if (this.tileBaseHinted.parent)
        // {
        // 	this.tileBaseHinted.removeChild(this.tileBaseHinted)
        // }
        // Tile.inter.remove(this.faceImg)
        // Tile.items.remove(this.tileBaseImgSelected)
        // Tile.items.remove(this.tileBaseImg)
        this.faceImg.destroy();
        this.tileBaseImgSelected.destroy();
        this.tileBaseImg.destroy();
        this.tileShadow.destroy();
        this.tileBaseHinted.destroy();
        // this.removeHint()
        if (!skipOpenMatches) {
            BoardManager.getOpenMatches();
        }
    };
    Tile.prototype.removeFace = function () {
        this.faceImg.destroy();
    };
    Tile.prototype.matched = function () {
        // this.remove();
        SimpleGame.myGame.time.events.add(1, function () {
            this.markedForRemoval = true;
        }, this);
        this.tileBaseImgSelected.anchor.set(0.5, 0.5);
        this.tileBaseImgSelected.x += this.tileBaseImgSelected.width * 0.5;
        this.tileBaseImgSelected.y += this.tileBaseImgSelected.height * 0.5;
        // this.faceImg.scale.set(1.1,1.1);
        // this.tileBaseImg.scale.set(1.1,1.1);
        // this.tileBaseImgSelected.scale.set(1.1,1.1);
        SimpleGame.myGame.add.tween(this.faceImg.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Back.In, true);
        SimpleGame.myGame.add.tween(this.tileBaseImgSelected.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Back.In, true);
        SimpleGame.myGame.add.tween(this.tileBaseImg.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Back.In, true);
        // SimpleGame.myGame.add.tween(this.tileBaseHinted.scale).to({x:0,y:0}, 300,  Phaser.Easing.Back.In, true)
        SimpleGame.myGame.add.tween(this.faceImg).to({ alpha: 0.85 }, 300, Phaser.Easing.Linear.None, true, 50);
        SimpleGame.myGame.add.tween(this.tileBaseImgSelected).to({ alpha: 0.85 }, 300, Phaser.Easing.Linear.None, true, 50);
        SimpleGame.myGame.add.tween(this.tileBaseImg).to({ alpha: 0.85 }, 300, Phaser.Easing.Linear.None, true, 50);
        SimpleGame.myGame.time.events.add(500, function () {
            this.remove();
        }, this);
        this.tileShadow.visible = false;
        this.faceImg.inputEnabled = false;
        this.tileBaseImg.inputEnabled = false;
        this.tileBaseImgSelected.inputEnabled = false;
        console.log("tilebasehinted: " + this.tileBaseHinted.visible);
        console.log("washinted: " + this.wasHinted);
        console.log("hintedstate: " + this.hintedState);
        if (this.tileBaseHinted.visible == true) {
            this.tileBaseImgSelected.visible = false;
            this.tileBaseHinted.visible = false;
        }
        else if (this.wasHinted == false) {
            this.tileBaseImgSelected.visible = true;
        }
        if (Tile.lastRemovedPiecesStack == null) {
            Tile.lastRemovedPiecesStack = new Array();
        }
        Tile.lastRemovedPiecesStack.push(this);
        // this.internalGroup.scale.
    };
    Tile.prototype.secondaryTween = function (delayedCallTime) {
        SimpleGame.myGame.time.events.add(delayedCallTime, function () {
            SimpleGame.myGame.add.tween(this.tileShadow).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            SimpleGame.myGame.add.tween(this.internalGroup).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
        }, this);
    };
    Tile.prototype.markForHint = function () {
        console.log("mark for hinted");
        this.deselect();
        this.hintTweenStart();
    };
    Tile.prototype.hintTweenStart = function () {
        // tileBaseHinted.visible = true;
        // tileBaseHinted.alpha.animate(0, 1, 0.66);
        // hintScr = EntityHelper.delayedCall(0.66, unhint, owner);
        this.tileBaseHinted.alpha = 0.2;
        SimpleGame.myGame.add.tween(this.tileBaseHinted).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000000, true);
        this.tileBaseHinted.visible = true;
        this.hintedState = true;
        this.wasHinted = true;
    };
    Tile.prototype.removeHint = function () {
        console.log("remov hint called!");
        // this.wasHinted = false;
        this.hintedState = false;
        // hintScr.dispose(); 
        //remove hint tween
        this.tileBaseHinted.visible = false;
        // 	console.log(this.wasHinted, this.hintedState, this.tileBaseHinted.visible)
        // 	SimpleGame.myGame.time.events.add(500, function()
        // {
        // 	console.log(this.wasHinted, this.hintedState, this.tileBaseHinted.visible)
        // }, this)
    };
    return Tile;
}());
var TileData = /** @class */ (function () {
    function TileData(tileX, tileY, tileZ, prepend, retFaceIdx, interMatchedType, graphicsName) {
        this.tileX = tileX;
        this.tileY = tileY;
        this.tileZ = tileZ;
        this.prepend = prepend;
        this.retFaceIdx = retFaceIdx;
        this.interMatchedType = interMatchedType;
        this.graphicsName = graphicsName;
    }
    return TileData;
}());
var TileUtil = /** @class */ (function () {
    function TileUtil() {
    }
    return TileUtil;
}());
var Trace = /** @class */ (function () {
    function Trace() {
    }
    return Trace;
}());
var OpenMenuBut = /** @class */ (function () {
    function OpenMenuBut() {
        SimpleGame.myGame.add.button();
    }
    return OpenMenuBut;
}());
var SoundButton = /** @class */ (function () {
    function SoundButton(parent, imgNormalName, imgOverName, x, y, skipText) {
        if (skipText === void 0) { skipText = false; }
        var soundontxt = SimpleGame.myGame.make.text(0, 0, "", {
            font: "16px Roboto", fill: "#252525", fontWeight: "700"
        });
        this.soundOnBut = new ButtonWithOverAndText(soundontxt, parent, imgNormalName, imgOverName, x, y, this.toggleSoundButton.bind(this));
        this.soundOnBut.setXY(x, y);
        var soundofftxt = SimpleGame.myGame.make.text(0, 0, "", {
            font: "16px Roboto", fill: "#252525", fontWeight: "700"
        });
        this.soundOffBut = new ButtonWithOverAndText(soundofftxt, parent, imgNormalName, imgOverName, x, y, this.toggleSoundButton.bind(this));
        this.soundOffBut.setXY(x, y);
        if (skipText) {
            soundontxt.text = "";
            soundofftxt.text = "";
        }
        this.setCorrectButtonVisible(true);
    }
    SoundButton.prototype.toggleSoundButton = function () {
        SoundButton.soundFlag = !SoundButton.soundFlag;
        // console.log("sound flag: " + SoundButton.soundFlag)
        this.setCorrectButtonVisible();
        SoundManager.setMuteFlags(!SoundButton.soundFlag);
        // console.log("mute flag: " + SoundManager.sManager.mute)
    };
    SoundButton.prototype.setCorrectButtonVisible = function (skipButtonOver) {
        if (skipButtonOver === void 0) { skipButtonOver = false; }
        // console.log("set correct but visible")
        if (SoundButton.soundFlag) {
            this.soundOnBut.setVisible();
            this.soundOffBut.setInvisible();
            if (!skipButtonOver)
                this.soundOnBut.onButtonOver();
        }
        else {
            this.soundOnBut.setInvisible();
            this.soundOffBut.setVisible();
            if (!skipButtonOver)
                this.soundOffBut.onButtonOver();
        }
    };
    SoundButton.soundFlag = true;
    return SoundButton;
}());
var SoundButton2 = /** @class */ (function () {
    function SoundButton2(parent, imgNormalName, imgOverName, imgNormalNameOff, imgOverNameOff, x, y) {
        // var soundontxt = SimpleGame.myGame.make.text(0,0,"",{
        //     font:"16px Roboto", fill:"#252525", fontWeight:"700"
        // })
        this.soundOnBut = new ButtonWithOverState(parent, imgNormalName, imgOverName, x, y, this.toggleSoundButton.bind(this));
        this.soundOnBut.setXY(x, y);
        this.soundOnBut.skipMouseOver = true;
        // var soundofftxt = SimpleGame.myGame.make.text(0,0,"",{
        //     font:"16px Roboto", fill:"#252525", fontWeight:"700"
        // })
        this.soundOffBut = new ButtonWithOverState(parent, imgNormalNameOff, imgOverNameOff, x, y, this.toggleSoundButton.bind(this));
        this.soundOffBut.setXY(x, y);
        this.soundOffBut.skipMouseOver = true;
        this.setCorrectButtonVisible(true);
    }
    SoundButton2.prototype.toggleSoundButton = function () {
        SoundButton.soundFlag = !SoundButton.soundFlag;
        // console.log("sound flag: " + SoundButton.soundFlag)
        this.setCorrectButtonVisible();
        SoundManager.setMuteFlags(!SoundButton.soundFlag);
        // console.log("mute flag: " + SoundManager.sManager.mute)
    };
    SoundButton2.prototype.setCorrectButtonVisible = function (skipButtonOver) {
        if (skipButtonOver === void 0) { skipButtonOver = false; }
        // console.log("set correct but visible")
        if (SoundButton.soundFlag) {
            this.soundOnBut.setVisible();
            this.soundOffBut.setInvisible();
            if (!skipButtonOver)
                this.soundOnBut.onButtonOver();
        }
        else {
            this.soundOnBut.setInvisible();
            this.soundOffBut.setVisible();
            if (!skipButtonOver)
                this.soundOffBut.onButtonOver();
        }
    };
    SoundButton2.soundFlag = true;
    return SoundButton2;
}());
var GameOver = /** @class */ (function () {
    function GameOver(win) {
        if (win === void 0) { win = false; }
        GameOver.win = win;
        console.log("game over added");
        GameOver.menuButton = SimpleGame.myGame.make.graphics(0, 0);
        GameOver.menuButton.beginFill(0xffffff);
        GameOver.menuButton.drawRect(0, 0, 800, 600);
        GameOver.menuButton.endFill();
        GameOver.menuButton.alpha = 0.001;
        GameUI.promptLayer.add(GameOver.menuButton);
        GameOver.menuButton.inputEnabled = true;
        GameOver.prompt = SimpleGame.myGame.make.sprite(400, 260, 'prompt_bg');
        GameOver.prompt.anchor.set(0.5, 0.5);
        GameOver.gameovertxt = SimpleGame.myGame.make.text(400, 260, Language.nomoremoves[Language.langIdx], { font: "24px Arial", fill: "#ffffff", fontWeight: "800", align: "Right" });
        GameOver.gameovertxt.anchor.set(0.5, 0.5);
        // GameOver.gameovertxt.setShadow(0,0,'#000000', 1);
        // GameOver.gameovertxt.stroke = '#000000'
        // GameOver.gameovertxt.strokeThickness = 1
        if (win) {
            GameOver.gameovertxt.text = Language.YOUWONGAME[Language.langIdx];
            GameOver.animation = SimpleGame.myGame.add.sprite(117, 77, 'animation');
            GameOver.animation.animations.add('play', Phaser.Animation.generateFrameNames('frames/', 0, 28, '', 4), 10, true, false);
            GameOver.animation.animations.play('play');
            GameUI.topLayer.add(GameOver.animation);
            // GameOver.animation = animation;
            SoundManager.eruption.allowMultiple = true;
            GameOver.playEruption();
            GameOver.createParticles();
            SimpleGame.myGame.time.events.add(2000, function () {
                GameUI.promptLayer.add(GameOver.prompt);
                GameUI.promptLayer.add(GameOver.gameovertxt);
                GameOver.menuButton.events.onInputDown.add(GameOver.onMenuButtonPressed, this);
            });
            SimpleGame.myGame.time.events.add(3100, function () {
            });
        }
        else {
            SoundManager.no_more_moves.play();
            GameUI.promptLayer.add(GameOver.prompt);
            GameUI.promptLayer.add(GameOver.gameovertxt);
            GameOver.menuButton.events.onInputDown.add(GameOver.onMenuButtonPressed, this);
        }
    }
    GameOver.createParticles = function () {
        GameOver.emitter = SimpleGame.myGame.add.emitter(1028, 748, 50);
        GameOver.emitter.makeParticles('smoke');
        GameOver.emitter.setXSpeed(-2, 2);
        GameOver.emitter.setYSpeed(1, 5);
        GameOver.emitter.gravity.set(0, -30);
        GameOver.emitter.scale.set(0.5, 0.5);
        //  By setting the min and max rotation to zero, you disable rotation on the particles fully
        GameOver.emitter.minRotation = 0;
        GameOver.emitter.maxRotation = 0;
        // emitter.setAlpha(0.4, 0.9)
        GameOver.emitter.setScale(0.3, 0.5);
        // emitter.autoAlpha = true;
        GameOver.emitter.start(false, 500, 250);
        GameOver.emmitter2 = SimpleGame.myGame.add.emitter(1028 * 0.5 / 0.3, 750 * 0.5 / 0.3, 50);
        GameOver.emmitter2.makeParticles('smoke');
        GameOver.emmitter2.setXSpeed(-2, 2);
        GameOver.emmitter2.setYSpeed(1, 5);
        GameOver.emmitter2.gravity.set(0, -20);
        GameOver.emmitter2.scale.set(0.3, 0.3);
        //  By setting the min and max rotation to zero, you disable rotation on the particles fully
        GameOver.emmitter2.minRotation = 0;
        GameOver.emmitter2.maxRotation = 0;
        GameOver.emmitter2.setAlpha(0.5, 1);
        // emmitter2.setScale()
        // emitter.autoAlpha = true;
        GameOver.emmitter2.start(false, 3500, 400);
    };
    GameOver.playEruption = function () {
        console.log("play eruption");
        SoundManager.eruption.play();
        // SimpleGame.myGame.time.events.add(1000+Math.random()*2000, GameOver.playEruption, this)      
    };
    GameOver.onMenuButtonPressed = function () {
        console.log("menu button pressed");
        SoundManager.playClick();
        GameOver.menuButton.destroy();
        GameOver.gameovertxt.destroy();
        if (GameOver.win) {
            GameOver.animation.destroy();
            GameOver.emitter.destroy();
            GameOver.emmitter2.destroy();
        }
        // GameOver.animation.visible = false
        // GameUI.promptLayer.remove(GameOver.animation)
        GameOver.prompt.destroy();
        BoardManager.resetBoard();
    };
    GameOver.win = false;
    return GameOver;
}());
var GameWonPrompt = /** @class */ (function () {
    function GameWonPrompt() {
        GameUI.gameStarted = false;
        SoundManager.won.play();
        this.blackbg = SimpleGame.myGame.make.graphics(0, 0);
        this.blackbg.beginFill(0x000000);
        this.blackbg.drawRect(0, 0, 880, 600);
        this.blackbg.endFill();
        this.blackbg.alpha = 0.7;
        this.blackbg.inputEnabled = true;
        GameUI.promptLayer.add(this.blackbg);
        this.menuBG = SimpleGame.myGame.add.sprite(0, 0, 'prompt_won');
        this.menuBG.x = (SimpleGame.myGame.width - this.menuBG.width) * 0.5;
        this.menuBG.y = 50;
        GameUI.promptLayer.add(this.menuBG);
        // this.menuBG.visible = false;
        var bestTime = Util.getStorage("bestTime", 99999999999999999);
        if (bestTime > GameUI.time) {
            bestTime = GameUI.time;
        }
        if (bestTime == 0) {
            bestTime = GameUI.time;
        }
        Util.setStorage("bestTime", bestTime);
        var wongameTxt = Language.YOUWONGAME[Language.langIdx].toUpperCase() + " " + Util.convertToHHMMSS(GameUI.time);
        this.menuText = SimpleGame.myGame.make.text(400, 400, "" + wongameTxt, {
            font: "24px Roboto", fill: "#eca61a", fontWeight: "900", align: "Center"
        });
        var bestgameTxt = "\n" + Language.best_time[Language.langIdx].toUpperCase() + " " + Util.convertToHHMMSS(bestTime);
        this.menuText.text += bestgameTxt;
        GameUI.promptLayer.add(this.menuText);
        this.menuText.anchor.set(0.5, 0.5);
        var restartText = SimpleGame.myGame.make.text(0, 0, "" + Language.RESTART[Language.langIdx].toUpperCase(), {
            font: "24px Roboto", fill: "#271a01", fontWeight: "900"
        });
        var restartBut = new ButtonWithOverAndText(restartText, GameUI.promptLayer, "prompt_button", "prompt_button_over", 0, 0, function () {
            console.log("yes clicked game");
            GameUI.promptLayer.removeAll(true);
            GameContext.firstBoard = true;
            BoardManager.resetBoard();
        });
        restartBut.setXY(this.menuBG.x + (this.menuBG.width - restartBut.imgNormal.width) * 0.5, this.menuBG.y + 390 - 11);
        this.menuText.y -= 31;
    }
    return GameWonPrompt;
}());
var NoMoreMoves = /** @class */ (function () {
    function NoMoreMoves() {
        SoundManager.no_more_moves.play();
        GameUI.gameStarted = false;
        this.blackbg = SimpleGame.myGame.make.graphics(0, 0);
        this.blackbg.beginFill(0x000000);
        this.blackbg.drawRect(0, 0, 880, 600);
        this.blackbg.endFill();
        this.blackbg.alpha = 0.7;
        this.blackbg.inputEnabled = true;
        GameUI.promptLayer.add(this.blackbg);
        this.menuBG = SimpleGame.myGame.add.sprite(0, 0, 'prompt_out_of_moves');
        this.menuBG.x = (SimpleGame.myGame.width - this.menuBG.width) * 0.5;
        this.menuBG.y = 70 - 20;
        GameUI.promptLayer.add(this.menuBG);
        // this.menuBG.visible = false;
        var wongameTxt = Language.nomoremoves_long[Language.langIdx].toUpperCase() + " ";
        this.menuText = SimpleGame.myGame.make.text(400, 400, "" + wongameTxt, {
            font: "24px Roboto", fill: "#eca61a", fontWeight: "900", align: "Center"
        });
        GameUI.promptLayer.add(this.menuText);
        this.menuText.anchor.set(0.5, 0.5);
        this.menuText.wordWrapWidth = 500;
        this.menuText.wordWrap = true;
        var restartText = SimpleGame.myGame.make.text(0, 0, "" + Language.shuffle[Language.langIdx].toUpperCase(), {
            font: "24px Roboto", fill: "#271a01", fontWeight: "900"
        });
        var restartBut = new ButtonWithOverAndText(restartText, GameUI.promptLayer, "prompt_button", "prompt_button_over", 0, 0, function () {
            console.log("yes clicked game");
            GameUI.promptLayer.removeAll();
            BoardManager.mix();
            GameContext.gameState = GameContext.STATE_PLAYING;
        });
        restartBut.setXY(this.menuBG.x + (this.menuBG.width - restartBut.imgNormal.width) * 0.5, this.menuBG.y + 390 - 11);
        this.menuText.y -= 31;
    }
    return NoMoreMoves;
}());
var ButtonWithOverState = /** @class */ (function () {
    function ButtonWithOverState(parent, imgNormalName, imgOverName, x, y, onClickFunction) {
        if (onClickFunction === void 0) { onClickFunction = function () {
        }; }
        this.onClickExecuted = false;
        this.skipClickSound = false;
        this.skipMouseOver = false;
        this.imgnormalnamestr = imgNormalName;
        this.parent = parent;
        this.imgNormalName = imgNormalName;
        this.imgOverName = imgOverName;
        this.x = x;
        this.y = y;
        this.imgNormal = SimpleGame.myGame.make.sprite(this.x, this.y, imgNormalName);
        this.imgOver = SimpleGame.myGame.make.sprite(this.x, this.y, imgOverName);
        parent.add(this.imgNormal);
        parent.add(this.imgOver);
        this.imgNormal.inputEnabled = this.imgOver.inputEnabled = false;
        this.imgOver.inputEnabled = false;
        if (SimpleGame.myGame.device.touch == false) {
            this.imgNormal.events.onInputOver.add(this.onButtonOver, this, 0);
        }
        // this.imgOver.events.onInputOver.add(this.onButtonOver, this, 0)
        this.imgNormal.events.onInputUp.add(this.banInput, this, 100);
        this.imgNormal.events.onInputDown.add(this.onButtonClicked, this, 2);
        this.imgNormal.events.onInputOut.add(this.onButtonOut, this, 1);
        this.imgOver.events.onInputOut.add(this.onButtonOut, this, 1);
        // this.imgOver.events.onInputDown.add(this.onButtonClicked, this,3)
        this.imgOver.events.onInputUp.add(this.onButtonOut, this, 4);
        this.imgNormal.events.onInputDown.add(function () {
            console.log("normal image clicked");
        }, this);
        this.imgOver.events.onInputDown.add(function () {
            console.log("over image clicked");
        }, this);
        this.onClickFunction = onClickFunction;
        this.imgOver.visible = false;
        this.loopEvent = SimpleGame.myGame.time.events.loop(100, this.update, this);
        this.loopEvent1 = SimpleGame.myGame.time.events.loop(10, this.update1, this);
        console.log("button created");
        SimpleGame.myGame.time.events.add(10, function () {
            if (GameUI.promptLayer != null) {
                if (GameUI.promptLayer.countLiving() <= 0) {
                    this.imgNormal.input.useHandCursor = true;
                }
                else {
                    this.imgNormal.input.useHandCursor = true;
                }
            }
            else {
                this.imgNormal.input.useHandCursor = true;
            }
            console.log("input enabled");
        }, this);
        this.imgNormal.inputEnabled = true;
        SimpleGame.myGame.input.onTap.add(function () {
            // console.log("mouse tapped")
        });
        this.imgNormal.events.onInputUp.add(function () {
            // console.log("input up")
        });
    }
    ButtonWithOverState.prototype.update = function () {
        //   console.log("update button: " + this.onClickExecuted)
        if (this.imgNormal.input != null) {
            if (this.skipMouseOver) {
                // console.log("remove hand cursor")
                // this.imgNormal.input.useHandCursor = false;
                // this.imgOver.visible = false;
            }
            else {
                // this.imgNormal.input.useHandCursor = true;
            }
        }
        if (this.imgOver.parent) {
            if (!this.imgOver.getBounds().contains(SimpleGame.myGame.input.x, SimpleGame.myGame.input.y)) {
                // this.onButtonOut();
                // this.imgNormal.input.useHandCursor = false;
            }
            else {
                //very dirty hack
                // if (this.imgnormalnamestr == "open_menu2")
                // {
                //     this.imgNormal.input.useHandCursor = true;
                //     this.onButtonOver();
                // }
            }
        }
        else {
            SimpleGame.myGame.time.events.remove(this.loopEvent);
        }
        this.setXY(this.x, this.y);
    };
    ButtonWithOverState.prototype.update1 = function () {
        //   console.log("update button: " + this.onClickExecuted)
        this.setXY(this.x, this.y);
    };
    ButtonWithOverState.prototype.banInput = function () {
        this.onClickExecuted = true;
        // console.log("button click success")
        SimpleGame.myGame.time.events.add(250, function () {
            // console.log("can click button")
            this.onClickExecuted = false;
        }, this);
    };
    ButtonWithOverState.prototype.onButtonOver = function () {
        console.log(SimpleGame.myGame.input.mousePointer.exists);
        console.log("button over");
        if (this.skipMouseOver) {
            if (SimpleGame.myGame.device.iOS || SimpleGame.myGame.device.android || SimpleGame.myGame.device.touch) {
                return;
            }
        }
        this.imgNormal.input.useHandCursor = true;
        this.imgOver.visible = true;
        this.imgNormal.alpha = 0.00001;
        SimpleGame.myGame.canvas.style.cursor = "pointer";
        console.log("mouse set to pointer");
        if (SimpleGame.myGame.device.touch) {
            // this.imgOver.visible = false;
        }
    };
    ButtonWithOverState.prototype.onButtonOut = function () {
        if (this.imgnormalnamestr == "open_menu2") {
            // console.log("button out")
        }
        this.imgOver.visible = false;
        this.imgNormal.alpha = 1;
        // this.imgNormal.input.useHandCursor = false;
    };
    ButtonWithOverState.prototype.onButtonClicked = function (evt) {
        //   console.log("button click attempt registered")
        //  var delay = Consts.DELAY_BETWEEN_EVENTS_DESKTOP;
        //  if (SimpleGame.myGame.device.touch)
        //  {
        //     delay = Consts.DELAY_BETWEEN_EVENTS_TOUCH;
        //  }
        // this.imgNormal.input.useHandCursor = false;
        if (this.onClickExecuted == false) {
            this.onClickExecuted = true;
            console.log("button click success");
            this.banInput();
            SimpleGame.myGame.time.events.add(60, function () {
                // console.log("can click button")
                this.onClickExecuted = false;
            }, this);
            this.onClickFunction();
            if (this.skipClickSound == false)
                SoundManager.playClick();
        }
        else {
            //  console.log("cannot click button")
        }
        SimpleGame.myGame.input.enabled = false;
        SimpleGame.myGame.time.events.add(0, function () {
            SimpleGame.myGame.input.enabled = true;
            SimpleGame.myGame.input.reset();
        });
    };
    ButtonWithOverState.prototype.setXY = function (x, y) {
        this.imgNormal.x = x;
        this.imgOver.x = x;
        this.x = x;
        this.imgNormal.y = y;
        this.imgOver.y = y;
        this.y = y;
    };
    ButtonWithOverState.prototype.setVisible = function () {
        console.log("set visible");
        this.parent.add(this.imgNormal);
        this.parent.add(this.imgOver);
        // this.parent.add(this.text);
    };
    ButtonWithOverState.prototype.setInvisible = function () {
        this.parent.remove(this.imgNormal);
        this.parent.remove(this.imgOver);
        // this.parent.remove(this.text);
    };
    return ButtonWithOverState;
}());
var ButtonWithOverAndText = /** @class */ (function (_super) {
    __extends(ButtonWithOverAndText, _super);
    function ButtonWithOverAndText(text, parent, imgNormalName, imgOverName, x, y, onClickFunction) {
        if (onClickFunction === void 0) { onClickFunction = function () {
        }; }
        var _this = _super.call(this, parent, imgNormalName, imgOverName, x, y, onClickFunction) || this;
        _this.fixedTxtCoords = false;
        _this.fixedTxtX = 0;
        _this.fixedTxtY = 0;
        _this.textY = 0;
        _this.textX = 0;
        _this.textYDelta = 0;
        _this.text = text;
        // this.text.inputEnabled = false;
        // this.text.interactive = false;
        // this.text.input.useHandCursor = true;
        parent.add(text);
        return _this;
    }
    ButtonWithOverAndText.prototype.setXY = function (x, y) {
        _super.prototype.setXY.call(this, x, y);
        if (this.fixedTxtCoords) {
            this.text.x = this.imgNormal.x + this.fixedTxtX;
            this.text.y = this.imgNormal.y + this.fixedTxtY;
        }
        else {
            this.text.x = this.imgNormal.x + 0.5 * (this.imgNormal.width - this.text.width);
            this.text.y = this.imgNormal.y + 0.5 * (this.imgNormal.height - 0.85 * this.text.height) + 1;
        }
        this.textX = this.text.x;
        this.textY = this.text.y + this.textYDelta;
        if (this.imgOver.visible) {
            this.text.y = this.textY;
        }
        else {
            this.text.y = this.textY;
        }
    };
    ButtonWithOverAndText.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.imgOver.visible) {
            this.text.y = this.textY;
        }
        else {
            this.text.y = this.textY;
        }
    };
    ButtonWithOverAndText.prototype.setVisible = function () {
        console.log("set visible");
        this.parent.add(this.imgNormal);
        this.parent.add(this.imgOver);
        this.parent.add(this.text);
    };
    ButtonWithOverAndText.prototype.setInvisible = function () {
        this.parent.remove(this.imgNormal);
        this.parent.remove(this.imgOver);
        this.parent.remove(this.text);
    };
    return ButtonWithOverAndText;
}(ButtonWithOverState));
var CheckboxControl = /** @class */ (function () {
    function CheckboxControl(parent, uncheckedImageName, checkedImageName, x, y) {
        this.isChecked = false;
        this.x = x;
        this.y = y;
        var uncheckedImage = SimpleGame.myGame.make.sprite(x, y, uncheckedImageName);
        parent.add(uncheckedImage);
        uncheckedImage.inputEnabled = true;
        uncheckedImage.events.onInputDown.add(this.switchState, this);
        var checkedImage = SimpleGame.myGame.make.sprite(x, y, checkedImageName);
        parent.add(checkedImage);
        checkedImage.inputEnabled = true;
        checkedImage.events.onInputDown.add(this.switchState, this);
        this.uncheckedImage = uncheckedImage;
        this.checkedImage = checkedImage;
        this.update();
    }
    CheckboxControl.prototype.update = function () {
        if (this.isChecked) {
            this.uncheckedImage.visible = false;
            this.checkedImage.visible = true;
        }
        else {
            this.uncheckedImage.visible = true;
            this.checkedImage.visible = false;
        }
    };
    CheckboxControl.prototype.switchState = function () {
        this.isChecked = !this.isChecked;
        this.update();
    };
    return CheckboxControl;
}());
var Utils;
(function (Utils) {
    var ScreenMetrics = /** @class */ (function () {
        function ScreenMetrics() {
        }
        return ScreenMetrics;
    }());
    Utils.ScreenMetrics = ScreenMetrics;
    var Orientation;
    (function (Orientation) {
        Orientation[Orientation["PORTRAIT"] = 0] = "PORTRAIT";
        Orientation[Orientation["LANDSCAPE"] = 1] = "LANDSCAPE";
    })(Orientation = Utils.Orientation || (Utils.Orientation = {}));
    ;
    var ScreenUtils = /** @class */ (function () {
        function ScreenUtils() {
        }
        // -------------------------------------------------------------------------
        ScreenUtils.calculateScreenMetrics = function (aDefaultWidth, aDefaultHeight, aOrientation, aMaxGameWidth, aMaxGameHeight) {
            if (aOrientation === void 0) { aOrientation = Orientation.LANDSCAPE; }
            // get dimension of window
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            // swap if window dimensions do not match orientation
            if ((windowWidth < windowHeight && aOrientation === Orientation.LANDSCAPE) ||
                (windowHeight < windowWidth && aOrientation === Orientation.PORTRAIT)) {
                var tmp = windowWidth;
                windowWidth = windowHeight;
                windowHeight = tmp;
            }
            // calculate max game dimension. The bounds are iPad and iPhone 
            if (typeof aMaxGameWidth === "undefined" || typeof aMaxGameHeight === "undefined") {
                if (aOrientation === Orientation.LANDSCAPE) {
                    aMaxGameWidth = Math.round(aDefaultWidth * 1420 / 1280);
                    aMaxGameHeight = Math.round(aDefaultHeight * 960 / 800);
                }
                else {
                    aMaxGameWidth = Math.round(aDefaultWidth * 960 / 800);
                    aMaxGameHeight = Math.round(aDefaultHeight * 1420 / 1280);
                }
            }
            // default aspect and current window aspect
            var defaultAspect = (aOrientation === Orientation.LANDSCAPE) ? 1280 / 800 : 800 / 1280;
            var windowAspect = windowWidth / windowHeight;
            var offsetX = 0;
            var offsetY = 0;
            var gameWidth = 0;
            var gameHeight = 0;
            // if (aOrientation === Orientation.LANDSCAPE) {
            // "iPhone" landscape ... and "iPad" portrait
            if (windowAspect > defaultAspect) {
                gameHeight = aDefaultHeight;
                gameWidth = Math.ceil((gameHeight * windowAspect) / 2.0) * 2;
                gameWidth = Math.min(gameWidth, aMaxGameWidth);
                offsetX = (gameWidth - aDefaultWidth) / 2;
                offsetY = 0;
            }
            else {
                gameWidth = aDefaultWidth;
                gameHeight = Math.ceil((gameWidth / windowAspect) / 2.0) * 2;
                gameHeight = Math.min(gameHeight, aMaxGameHeight);
                offsetX = 0;
                offsetY = (gameHeight - aDefaultHeight) / 2;
            }
            /* } else {    // "iPhone" portrait
                if (windowAspect < defaultAspect) {
                    gameWidth = aDefaultWidth;
                    gameHeight = gameWidth / windowAspect;
                    gameHeight = Math.min(gameHeight, aMaxGameHeight);
                    offsetX = 0;
                    offsetY = (gameHeight - aDefaultHeight) / 2;
                } else {    // "iPad" portrait
                    gameHeight = aDefaultHeight;
                    gameWidth = gameHeight = windowAspect;
                    gameWidth = Math.min(gameWidth, aMaxGameWidth);
                    offsetX = (gameWidth - aDefaultWidth) / 2;
                    offsetY = 0;
                }
            }
            */
            // calculate scale
            var scaleX = windowWidth / gameWidth;
            var scaleY = windowHeight / gameHeight;
            // store values
            this.screenMetrics = new ScreenMetrics();
            this.screenMetrics.windowWidth = windowWidth;
            this.screenMetrics.windowHeight = windowHeight;
            this.screenMetrics.defaultGameWidth = aDefaultWidth;
            this.screenMetrics.defaultGameHeight = aDefaultHeight;
            this.screenMetrics.maxGameWidth = aMaxGameWidth;
            this.screenMetrics.maxGameHeight = aMaxGameHeight;
            this.screenMetrics.gameWidth = gameWidth;
            this.screenMetrics.gameHeight = gameHeight;
            this.screenMetrics.scaleX = scaleX;
            this.screenMetrics.scaleY = scaleY;
            this.screenMetrics.offsetX = offsetX;
            this.screenMetrics.offsetY = offsetY;
            return this.screenMetrics;
        };
        return ScreenUtils;
    }());
    Utils.ScreenUtils = ScreenUtils;
})(Utils || (Utils = {}));
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.convertToHHMMSS = function (seconds) {
        var s = seconds % 60;
        var m = Math.floor((seconds % 3600) / 60);
        var h = Math.floor(seconds / (60 * 60));
        //var hourStr:String = (h == 0) ? "" : doubleDigitFormat(h) + ":";
        var hourStr = (false) ? "" : Util.doubleDigitFormat(h) + ":";
        var minuteStr = Util.doubleDigitFormat(m) + ":";
        var secondsStr = Util.doubleDigitFormat(s);
        return hourStr + minuteStr + secondsStr;
    };
    Util.convertToMMSS = function (seconds) {
        var s = seconds % 60;
        var m = Math.floor((seconds % 3600) / 60);
        var h = Math.floor(seconds / (60 * 60));
        //var hourStr:String = (h == 0) ? "" : doubleDigitFormat(h) + ":";
        var hourStr = (false) ? "" : Util.doubleDigitFormat(h) + ":";
        var minuteStr = Util.doubleDigitFormat(m) + ":";
        var secondsStr = Util.doubleDigitFormat(s);
        return minuteStr + secondsStr;
    };
    Util.doubleDigitFormat = function (num) {
        if (num < 10) {
            return ("0" + num);
        }
        return "" + num;
    };
    Util.getStorage = function (s, defaultRetValue) {
        if (defaultRetValue === void 0) { defaultRetValue = 0; }
        var storageData = 0;
        try {
            storageData = parseInt(window.localStorage.getItem(s));
        }
        catch (error) {
            return 0;
        }
        if (isNaN(storageData)) {
            storageData = 0;
            try {
                window.localStorage.setItem(s, defaultRetValue.toString());
            }
            catch (error) {
                return 0;
            }
        }
        return storageData;
    };
    Util.setStorage = function (s, val) {
        try {
            window.localStorage.setItem(s, val.toString());
        }
        catch (error) {
        }
    };
    Util.clearStorage = function (s, defaultVal) {
        if (defaultVal === void 0) { defaultVal = 0; }
    };
    Util.fixedDigitCount = function (digits, number) {
        var digitCount = number.toString().length;
        var deltaCount = digits - digitCount;
        var retStr = "";
        while (deltaCount-- > 0) {
            retStr += "0";
        }
        retStr += number.toString();
        return retStr;
    };
    return Util;
}());
