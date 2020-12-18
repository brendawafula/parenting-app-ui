import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { filter, takeUntil, takeWhile } from "rxjs/operators";
import { FlowTypes } from "../../model";
import { TASK_LIST } from "../data/data.service";
import { TaskActionService } from "./task-action.service";

@Injectable({ providedIn: "root" })
export class TaskService {
  allTasksById: Hashmap<FlowTypes.Task_listRow> = {};

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private taskActions: TaskActionService
  ) {
    console.log("task service", this.modalCtrl);
    this.processTaskList();
    this.processTaskActionHistory();
  }

  /*******************************************************************************
   * Public methods
   *******************************************************************************/

  /**
   * When running a task we want to trigger any required actions,
   * and add listeners to handle any completion events
   */
  async startTask(task_id: string) {
    const task = this.allTasksById[task_id];
    if (!task) {
      throw new Error(`task not found: ${task_id}`);
    }
    const { start_action, evaluation } = task;

    // Make sure evaluation listeners are ready ahead of starting action in case
    // they instantly resolve on start
    if (evaluation) {
      console.log("TODO - handle evaluation", evaluation);
      this.taskActions.action$
        .pipe(
          filter((v) => v.task_id === task_id),
          takeWhile((v) => v.actionSubType !== "completed")
        )
        .subscribe(
          (t) => {
            console.log("action", t);
          },
          (err) => console.error(err),
          () => {
            this.taskActions.recordTaskAction(task_id, "completed");
          }
        );
      // TODO - add listeners/methods to know when task has been complete
    }
    if (start_action) {
      await this.taskActions.recordTaskAction(task_id, "started");
      this.runAction(task);
    }
    // If no evaluation criteria can mark as completed immediately
    if (!evaluation) {
      this.taskActions.recordTaskAction(task_id, "completed");
    }
  }

  /** Provide specific handlers for actions, such as starting a flow */
  public async runAction(task: FlowTypes.Task_listRow) {
    const handlers: {
      [key in FlowTypes.Task_listRow["start_action"]]: (
        task: FlowTypes.Task_listRow
      ) => Promise<any>;
    } = {
      give_award: () => this.handleGiveAwardAction(task),
      start_new_flow: () => this.handleStartNewFlowAction(task),
      open_app: null,
    };
    return handlers[task.start_action](task);
  }

  /*******************************************************************************
   * Initialisation
   *******************************************************************************/

  /** Generate a hashmap of all tasks sorted by id */
  private processTaskList() {
    const allTasksById: Hashmap<FlowTypes.Task_listRow> = {};
    TASK_LIST.forEach((taskFlow) => {
      taskFlow.rows.forEach((taskRow) => {
        allTasksById[taskRow.id] = taskRow;
      });
    });
    this.allTasksById = allTasksById;
  }
  private async processTaskActionHistory() {
    // this.taskActions = await this.dbService.table<ITaskAction>("taskActions").toArray();
  }

  /*******************************************************************************
   * Specific action handlers
   *******************************************************************************/

  // private async addTaskAction(action: ITaskAction) {
  //   // await this.dbService.table<ITaskAction>("taskActions").put(action as ITaskAction);
  //   // await this.loadActions();
  // }
  // private async removeTaskAction(id: string) {
  //   // await this.dbService.table("taskActions").delete(id);
  //   // await this.loadActions();
  // }

  /** Launch a flow using the chat page interface, passing the flow id for starting */
  private async handleStartNewFlowAction(task: FlowTypes.Task_listRow) {
    const { flow_name, flow_type } = task;
    if (!flow_name || !flow_type) {
      throw new Error("flow type or name not specified");
    }
    this.router.navigate([flow_type, flow_name]);
  }

  private async handleGiveAwardAction(task: FlowTypes.Task_listRow) {
    const { start_action_args } = task;
    console.log("handle give award", start_action_args);
    // TODO
  }
}

interface Hashmap<T> {
  [key: string]: T;
}
