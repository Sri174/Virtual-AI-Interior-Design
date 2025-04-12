# backend/design/ai_generator.py
import cv2
import numpy as np
import tensorflow as tf
from PIL import Image

class AIDesignGenerator:
    def __init__(self):
        self.model = tf.keras.models.load_model('interior_design_model.h5')
        self.class_labels = ['modern', 'classic', 'minimalist']

    def process_image(self, image_path):
        # Preprocess input
        img = Image.open(image_path).convert('RGB')
        img = img.resize((256, 256))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Get AI predictions
        predictions = self.model.predict(img_array)
        style = self.class_labels[np.argmax(predictions[0])]
        layout = self.generate_layout(predictions[1])
        
        return {
            'style': style,
            'layout': layout,
            'elements': self.generate_design_elements(predictions)
        }

    def generate_layout(self, heatmap):
        # Convert heatmap to SVG coordinates
        return {
            'walls': self._process_heatmap(heatmap[0]),
            'windows': self._process_heatmap(heatmap[1]),
            'doors': self._process_heatmap(heatmap[2])
        }
