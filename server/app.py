from app.model import *
from app.visualization import *

if __name__ == "__main__":
    msg = "Hi, my name is Oliver."

    model = Model()

    inputs = model.tokenizer(msg, return_tensors="pt")
    input_ids = inputs['input_ids'][0].tolist()
    tokens = model.tokenizer.convert_ids_to_tokens(input_ids)

    viz = Viz(model.get_attentions(msg))
    viz.viz_heatmap(tokens, 0, 0, 0)


