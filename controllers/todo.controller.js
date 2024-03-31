const TodoModel = require('../model/todo.model');
const asyncHandler = require("../middleware/async");

exports.createTodo = asyncHandler(async (req, res, next) => {
    const createdModel = await TodoModel.create(req.body);
    res.status(201).json(createdModel);
});

exports.getTodos = asyncHandler(async (req, res, next) => {
    const allTodos = await TodoModel.find({});
    res.status(200).json(allTodos);
});

exports.getTodoById = asyncHandler(async (req, res, next) => {
    const toDo = await TodoModel.findById(req.params.todoId);
    (toDo) ? res.status(200).json(toDo) : res.status(404).json(null);
});

exports.updateTodo = asyncHandler(async (req, res, next) => {
    const updatedTodo = await TodoModel.findByIdAndUpdate(req.params.todoId, req.body, { new: true, useFindAndModify: false});
    updatedTodo ? res.status(200).json(updatedTodo) : res.status(404).send();
});

exports.deleteTodo = asyncHandler(async (req, res, next) => {
    const deletedTodo = await TodoModel.findByIdAndDelete(req.params.todoId);
    deletedTodo ? res.status(200).json(deletedTodo) : res.status(404).send();
});
