import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

class Fib extends Component {
  state = {
    index: null,
    values: {},
    seenIndexs: [],
  };

  componentDidMount() {
    this.fetchSeenIndex();
    this.fetchValues();
  }

  async fetchValues() {
    try {
      const response = await axios.get("/api/values/current");
      if (response.status === 200) {
        this.setState({ values: response.data.data });
      }
    } catch (e) {
      toast.error(e.message);
    }
  }
  async fetchSeenIndex() {
    try {
      const response = await axios.get("/api/values/all");
      if (response.status === 200) {
        this.setState({ seenIndexs: response.data.data });
      }
    } catch (e) {
      toast.error(e.message);
    }
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/values", {
        index: this.state.index,
      });
      if (response.status === 201) {
        this.setState({ index: "" });
        e.target.reset();
        this.fetchSeenIndex();
        this.fetchValues();
        toast.success(response.data.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  renderSeenIndexes() {
    return this.state.seenIndexs.map(({ number }) => number).join(", ");
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} i calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <h4>fibonaci finder application</h4>
        <form onSubmit={this.onSubmit}>
          <input
            defaultValue={this.state.index}
            type="text"
            name="index"
            className="form-control"
            onChange={this.onChange}
            placeholder="Enter index to find the fibonaci number"
          />

          <button className="mt-2 btn btn-primary">Calculate</button>
        </form>

        <hr />
        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}
        <h3>Calculated values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
