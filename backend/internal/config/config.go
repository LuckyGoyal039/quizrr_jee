package config

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

type Httpserver struct {
	Address string
}
type Config struct {
	Env        string `yaml:"env" env:"ENV" env-default:"production" env-required:"true"` //struct tags
	Httpserver `yaml:"http_server"`
}

func MustLoad() *Config {
	var configPath string

	configPath = os.Getenv("CONFIG_PATH")
	if configPath == "" {
		flags := flag.String("config", "", "path to configuration file")
		flag.Parse()

		configPath = *flags
	}

	if configPath == "" {
		fmt.Println("No configuration path provided.")
	}

	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		log.Fatalf("config path does not exist: %s", configPath)
	}

	var cfg Config

	err := cleanenv.ReadConfig(configPath, &cfg)

	if err != nil {
		log.Fatalf("cannot read config file: %s", err.Error())
	}

	return &cfg
}
