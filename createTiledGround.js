var createTiledGround = function (xmin, zmin, xmax, zmax, precision, subdivisions) {
    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var row, col, tileRow, tileCol;

    subdivisions = subdivisions || {'w' : 1, 'h' : 1};
    precision    = precision    || {'w' : 1, 'h' : 1};

    var totalSubdiv = {
        'w' : (subdivisions.w * precision.w),
        'h' : (subdivisions.h * precision.h),
    };

    // Position normals & uvs
    var position = new BABYLON.Vector3.Zero();
    var normal = new BABYLON.Vector3(0, 1.0, 0);
    for (row = 0; row <= totalSubdiv.h; row++) {
        position.z = (row * (zmax - zmin)) / totalSubdiv.h + zmin;
        for (col = 0; col <= totalSubdiv.w; col++) {
            position.x = (col * (xmax - xmin)) / totalSubdiv.w + xmin;
            position.y = 0;

            positions.push(position.x, position.y, position.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push((col / precision.w) % 1, (row / precision.h) % 1);
        }
    }

    // Indices
    var rowLength = totalSubdiv.w + 1;
    for (tileRow = 0; tileRow < subdivisions.h; tileRow++) {
        for (tileCol = 0; tileCol < subdivisions.w; tileCol++) {
            for (row = 0; row < precision.h; row++) {
                for (col = 0; col < precision.w; col++) {
                    var square = [
                        col + row * rowLength + tileCol * precision.w + tileRow * rowLength * precision.h,
                        (col + 1) + row * rowLength + tileCol * precision.w + tileRow * rowLength * precision.h ,
                        (col + 1) + (row + 1) * rowLength + tileCol * precision.w + tileRow * rowLength * precision.h,
                        col + (row + 1) * rowLength + tileCol * precision.w + tileRow * rowLength * precision.h
                    ];

                    indices.push(square[1]);
                    indices.push(square[2]);
                    indices.push(square[3]);
                    indices.push(square[0]);
                    indices.push(square[1]);
                    indices.push(square[3]);
                }
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
