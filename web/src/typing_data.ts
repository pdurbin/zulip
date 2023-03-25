import * as muted_users from "./muted_users";
import * as util from "./util";

// See docs/subsystems/typing-indicators.md for details on typing indicators.

const pm_typists_dict = new Map<string, number[]>();
const stream_typists_dict = new Map<string, number[]>();
const inbound_timer_dict = new Map<string, ReturnType<typeof setInterval> | undefined>();

export function clear_for_testing(): void {
    pm_typists_dict.clear();
    stream_typists_dict.clear();
    inbound_timer_dict.clear();
}

// function to_int(s) {
//     return Number.parseInt(s, 10);
// }

// export function get_pms_key(group) {
// function get_key(group: number[]): string {
export function get_pms_key(group: number[]): string {
    const ids = util.sorted_ids(group);
    return ids.join(",");
}
    
// <<<<<<< HEAD:web/src/typing_data.ts
// const typist_dct = new Map<string, number[]>();
// const inbound_timer_dict = new Map<string, ReturnType<typeof setInterval> | undefined>();

// export function clear_for_testing(): void {
//     typist_dct.clear();
//     inbound_timer_dict.clear();
// }
// 
// function get_key(group: number[]): string {
// =======
// const pm_typists_dict = new Map();
// const stream_typists_dict = new Map();
// const inbound_timer_dict = new Map();

// export function clear_for_testing() {
//     pm_typists_dict.clear();
//     stream_typists_dict.clear();
//     inbound_timer_dict.clear();
// }

// function to_int(s) {
//     return Number.parseInt(s, 10);
// }

// export function get_pms_key(group) {
// >>>>>>> 1bcfb88058 (typing indicators for streams #11152):static/js/typing_data.js
//     const ids = util.sorted_ids(group);
//     return ids.join(",");
// }


export function get_topic_key(stream_id: number, topic: string): string {
    topic = topic.toLowerCase(); // Topics are case-insensitive
    return JSON.stringify({stream_id, topic});
}

export function get_typist_dict(message_type: string): Map<string, number[]> {
    if (message_type === "stream") {
        return stream_typists_dict;
    }

    if (message_type === "private") {
        return pm_typists_dict;
    }
    throw new Error(`Unknown message_type: ${message_type}`);
}

// export function add_typist(key, typist, message_type) {
export function add_typist(group: number[], key: string, typist: number, message_type: string): void {
    const typist_dict = get_typist_dict(message_type);
    const current = typist_dict.get(key) || [];
    // const current = typist_dict.get(typist_dict) || [];
    // typist = to_int(typist);
    // typist = Number.parseInt(typist, 10);
    // const typist2 = Number.parseInt(typist, 10);
    if (!current.includes(typist)) {
        current.push(typist);
    }
    typist_dict.set(key, util.sorted_ids(current));
}


// <<<<<<< HEAD:web/src/typing_data.ts
// export function add_typist(group: number[], typist: number): void {
//     const key = get_key(group);
//     const current = typist_dct.get(key) || [];
// =======
// export function get_topic_key(stream_id, topic) {
//     topic = topic.toLowerCase(); // Topics are case-insensitive
//     return JSON.stringify({stream_id, topic});
// }

// export function get_typist_dict(message_type) {
//     if (message_type === "stream") {
//         return stream_typists_dict;
//     }

//     if (message_type === "private") {
//         return pm_typists_dict;
//     }
//     throw new Error(`Unknown message_type: ${message_type}`);
// }

// export function add_typist(key, typist, message_type) {
//     const typist_dict = get_typist_dict(message_type);
//     const current = typist_dict.get(key) || [];
//     typist = to_int(typist);
// >>>>>>> 1bcfb88058 (typing indicators for streams #11152):static/js/typing_data.js
//     if (!current.includes(typist)) {
//         current.push(typist);
//     }
//     typist_dict.set(key, util.sorted_ids(current));
// }

// export function remove_typist(key, typist, message_type) {
export function remove_typist(group: number[], key: string, typist: number, message_type: string): boolean {
    const typist_dict = get_typist_dict(message_type);
    let current = typist_dict.get(key) || [];

    if (!current.includes(typist)) {
        return false;
    }

    current = current.filter((user_id) => user_id !== typist);

    typist_dict.set(key, current);
    return true;
}



// <<<<<<< HEAD:web/src/typing_data.ts
// export function remove_typist(group: number[], typist: number): boolean {
//     const key = get_key(group);
//     let current = typist_dct.get(key) || [];
// =======
// export function remove_typist(key, typist, message_type) {
//     const typist_dict = get_typist_dict(message_type);
//     let current = typist_dict.get(key) || [];
// >>>>>>> 1bcfb88058 (typing indicators for streams #11152):static/js/typing_data.js

//     if (!current.includes(typist)) {
//         return false;
//     }

//     current = current.filter((user_id) => user_id !== typist);

//     typist_dict.set(key, current);
//     return true;
// }

// export function get_group_typists(group) {
export function get_group_typists(group: number[]): number[] {
    const key = get_pms_key(group);
    const user_ids = pm_typists_dict.get(key) || [];
    return muted_users.filter_muted_user_ids(user_ids);
}

// <<<<<<< HEAD:web/src/typing_data.ts
// export function get_group_typists(group: number[]): number[] {
//     const key = get_key(group);
//     const user_ids = typist_dct.get(key) || [];
//     return muted_users.filter_muted_user_ids(user_ids);
// }

// export function get_all_typists(): number[] {
//     let typists = [...typist_dct.values()].flat();
// =======
// export function get_group_typists(group) {
//     const key = get_pms_key(group);
//     const user_ids = pm_typists_dict.get(key) || [];
//     return muted_users.filter_muted_user_ids(user_ids);
// }

// export function get_all_pms_typists() {
// export function get_all_typists(): number[] {
export function get_all_pms_typists() : number[] {
//     let typists = [...typist_dct.values()].flat();
    let typists = [...pm_typists_dict.values()].flat();
    // let typists = Array.from(pm_typists_dict.values()).flat();
    typists = util.sorted_ids(typists);
    return muted_users.filter_muted_user_ids(typists);
}

// export function get_stream_typists(stream_id, topic) {
export function get_stream_typists(stream_id: number, topic: string): number[] {
    const typists = stream_typists_dict.get(get_topic_key(stream_id, topic)) || [];
    return muted_users.filter_muted_user_ids(typists);
}

// The next functions aren't pure data, but it is easy
// enough to mock the setTimeout/clearTimeout functions.

// export function clear_inbound_timer(group: number[]): void {
// export function clear_inbound_timer(key) {
export function clear_inbound_timer(group: number[], key: string): void {
    const timer = inbound_timer_dict.get(key);
    if (timer) {
        clearTimeout(timer);
        inbound_timer_dict.set(key, undefined);
    }
}

// <<<<<<< HEAD:web/src/typing_data.ts
// export function clear_inbound_timer(group: number[]): void {
//     const key = get_key(group);
// =======
// export function clear_inbound_timer(key) {
// >>>>>>> 1bcfb88058 (typing indicators for streams #11152):static/js/typing_data.js
//     const timer = inbound_timer_dict.get(key);
//     if (timer) {
//         clearTimeout(timer);
//         inbound_timer_dict.set(key, undefined);
//     }
// }
// export function kickstart_inbound_timer(
//     group: number[],
//     delay: number,
//     callback: () => void,
// ): void {
    // export function kickstart_inbound_timer(        group: number[],        delay: number,        callback: () => void,    ): void {
// export function kickstart_inbound_timer(key, delay, callback) {
export function kickstart_inbound_timer(group: number[], key: string, delay: number, callback: () => void,): void {
    // clear_inbound_timer(key);
    clear_inbound_timer(group, key);
    const timer = setTimeout(callback, delay);
    inbound_timer_dict.set(key, timer);
}



// <<<<<<< HEAD:web/src/typing_data.ts
// export function kickstart_inbound_timer(
//     group: number[],
//     delay: number,
//     callback: () => void,
// ): void {
//     const key = get_key(group);
//     clear_inbound_timer(group);
// =======
// export function kickstart_inbound_timer(key, delay, callback) {
//     clear_inbound_timer(key);
// >>>>>>> 1bcfb88058 (typing indicators for streams #11152):static/js/typing_data.js
//     const timer = setTimeout(callback, delay);
//     inbound_timer_dict.set(key, timer);
// }
