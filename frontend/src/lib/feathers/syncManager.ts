import { store } from '../../redux/store'
import { dataAdded as urlDataAdded, findAsync as findUrlsAsync } from '../../redux/features/urls/urlsSlice'

import client from './feathersClient'

import type { Url } from '../../models/Url'

export class SyncManager {
  private static running: boolean = false

  static async init(): Promise<void> {
    if (SyncManager.running) {
      return
    }

    SyncManager.running = true

    SyncManager.fetchInitialData()
    SyncManager.initSyncOnEvent()
  }

  private static async fetchInitialData(): Promise<void> {
    store.dispatch(findUrlsAsync())
  }

  private static initSyncOnEvent(): void {
    client.service('urls').on('patch', (url: Url) => {
      store.dispatch(urlDataAdded(url))
    })
  }

  private constructor() {}
}
