import cv2
import numpy as np
import sys

img_path = 'public/assets/ai_logo_3d.png'
out_path = 'public/assets/ai_logo_wireframe.png'

try:
    img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print("Error: Could not read image.")
        sys.exit(1)

    # We only care about the opaque shapes, ignoring the 3D internal details and soft shadows.
    if img.shape[2] == 4:
        mask = img[:,:,3]
        # Threshold to remove soft shadows. Only solid shapes remain.
        _, solid_mask = cv2.threshold(mask, 200, 255, cv2.THRESH_BINARY)
        
        # Canny edge detection strictly on the solid mask.
        # This gives us only the OUTER contours of the letters/dot.
        edges = cv2.Canny(solid_mask, 100, 200)
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 100, 200)

    # Dilate the edges slightly to make the line thicker and more visible as a mask
    kernel = np.ones((2,2), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=1)

    h, w = edges.shape
    result = np.zeros((h, w, 4), dtype=np.uint8)
    result[:,:,0] = 255 # R
    result[:,:,1] = 255 # G
    result[:,:,2] = 255 # B
    result[:,:,3] = edges # Alpha channel (mask transparent where no edge)

    cv2.imwrite(out_path, result)
    print("Clean outer wireframe saved successfully!")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
