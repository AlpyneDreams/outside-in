import bpy

frame = 0
for key in bpy.data.objects['evert0'].data.shape_keys.key_blocks:
    key.value = 0
    key.keyframe_insert("value", frame=frame)
    frame += 1


lastkey = None
frame = 1
for key in bpy.data.objects['evert0'].data.shape_keys.key_blocks:
    if lastkey is not None:
        lastkey.value = 0
        lastkey.keyframe_insert("value", frame=frame)
    key.value = 1
    key.keyframe_insert("value", frame=frame)
    
    lastkey = key
    frame += 1

lastkey.value = 0