import { Configuration } from "@/domain/enterprise/configuration/configuration";
import { ConfigurationRepository } from "@/domain/enterprise/configuration/configuration-repository";

export class InMemoryConfigurationRepository implements ConfigurationRepository {
  public items: Configuration[] = []

  async findById(id: string): Promise<Configuration | null> {
    const configuration = this.items.find((configuration) => configuration.id.toString() === id)

    if (!configuration) {
      return null
    }

    return configuration
  }

  async create(configuration: Configuration): Promise<void> {
    this.items.push(configuration)
  }

  async update(configuration: Configuration): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === configuration.id)
    this.items[itemIndex] = configuration
  }

  async delete(configurationId: string): Promise<void> {
    const filteredConfigurations = this.items.filter((configuration) => configuration.id.toString() !== configurationId)
    this.items = filteredConfigurations
  }
}