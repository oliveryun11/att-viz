import torch
import matplotlib.pyplot as plt
import io

class Viz:
    def __init__(self, attentions):
        self.attentions = attentions

    def viz_heatmap(self, tokens, layer, batch, head):
        matrix = self.attentions[layer][batch][head].detach().numpy()
        
        im = plt.imshow(matrix)
        plt.xticks(range(len(tokens)), tokens)
        plt.yticks(range(len(tokens)), tokens)
        plt.colorbar(im, label = "Attention Score")
        
        img_io = io.BytesIO()
        plt.savefig(img_io, format = 'png', bbox_inches = 'tight')
        img_io.seek(0)

        plt.close()

        return img_io
