from transformers import AutoTokenizer, DistilBertConfig, DistilBertModel
import torch

class Model:
    def __init__(self):
        self.config = DistilBertConfig.from_pretrained(
            "distilbert-base-uncased", 
            output_attentions = True,
            attn_implementation = "eager"
            )
        self.tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
        self.model = DistilBertModel(self.config)
    
    def get_attentions(self, input):
        x = self.tokenizer(input, return_tensors = "pt")
        y = self.model(**x)

        return y.attentions


if __name__ == "__main__":
    model = Model()
    model.get_attentions("Hi, my name is Oliver.")
    #print(model.get_attentions("Hi, my name is Oliver."))