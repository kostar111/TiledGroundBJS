var createTiledGround = function (xmin, zmin, xmax, zmax, precision, subdivisions) {
    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var row, col, tileRow, tileCol;

    subdivisions.h = subdivisions.h || 1;
    subdivisions.w = subdivisions.w || 1;
    precision.h = precision.h || 1;
    precision.w = precision.w || 1;

    var tileSize = {
        'w' : (xmax - xmin) / subdivisions.w,
        'h' : (zmax - zmin) / subdivisions.h
    };

    for (tileRow = 0; tileRow < subdivisions.h; tileRow++) {
        for (tileCol = 0; tileCol < subdivisions.w; tileCol++) {
            applyTile(
                xmin + (tileCol * tileSize.w),
                zmin + (tileRow * tileSize.h),
                xmin + ((tileCol + 1) * tileSize.w),
                zmin + ((tileRow + 1) * tileSize.h)
            );
        }
    }

    function applyTile (xTileMin, zTileMin, xTileMax, zTileMax) {
        // Indices
        var base = positions.length/3;
        var rowLength = precision.w + 1;
        for (row = 0; row < precision.h; row++) {
            for (col = 0; col < precision.w; col++) {
                var square = [
                    base +  col + row * rowLength,
                    base + (col + 1) + row * rowLength,
                    base + (col + 1) + (row + 1) * rowLength,
                    base +  col + (row + 1) * rowLength
                ];

                indices.push(square[1]);
                indices.push(square[2]);
                indices.push(square[3]);
                indices.push(square[0]);
                indices.push(square[1]);
                indices.push(square[3]);
            }
        }

        // Position, normals and uvs
        var position = new BABYLON.Vector3.Zero();
        var normal = new BABYLON.Vector3(0, 1.0, 0);
        for (row = 0; row <= precision.h; row++) {
            position.z = (row * (zTileMax - zTileMin)) / precision.h + zTileMin;
            for (col = 0; col <= precision.w; col++) {
                position.x = (col * (xTileMax - xTileMin)) / precision.w + xTileMin;
                position.y = 0;

                positions.push(position.x, position.y, position.z);
                normals.push(normal.x, normal.y, normal.z);
                uvs.push(col / precision.w, row / precision.h);
            }
        }
    }

    console.log(uvs);
    // Result
    var vertexData = new BABYLON.VertexData();

    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    return vertexData;
};
