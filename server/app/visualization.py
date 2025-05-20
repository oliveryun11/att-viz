import torch
import matplotlib.pyplot as plt

class Viz:
    def __init__(self, attentions):
        self.attentions = attentions

    def viz_heatmap(self, tokens, layer, batch, head):
        print(tokens)
        matrix = self.attentions[layer][batch][head].detach().numpy()
        
        im = plt.imshow(matrix)
        plt.xticks(range(len(tokens)), tokens)
        plt.yticks(range(len(tokens)), tokens)
        plt.colorbar(im, label = "Attention Score")
        plt.show()
        
