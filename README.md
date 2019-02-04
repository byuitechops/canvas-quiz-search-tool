# Canvas Quiz Search Tool

## Description 
The canvas quiz search tool allows the user to search all of a course's quiz questions and recieve a report of the quiz questions found.
The tool requires a CSV of course IDs to perform the search on. The tool will search each course's quizzes. The search is done bu applying zero or 
more filters. If zero filters are applied the search returns all of the quiz questions. When one or more filters are applied the search 
returns only questions that match all of the filters selected (This is an AND search not an OR search). There currently isn't a limit to
the amount of filters that can be applied to the search. However, there are a limited amount of filters available to apply. Once the 
search is complete the tool will create a report that contains information about each quiz question that was returned in the search.

## How to Install

Standard Install

1. Clone this repository:
    ```bash
    git clone https://github.com/byuitechops/canvas-quiz-search-tool.git
    ```
1. Step into the folder that was just created 
    ```bash
    cd ./canvas-quiz-search-tool
    ```
1. To install dependancies, run:
    ```bash
    npm i
    ```

1. To initialize the program, run:
    ```bash
    npm start
    ```